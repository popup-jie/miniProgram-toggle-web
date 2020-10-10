const { compoentsConfig } = require('../config')
const fs = require('fs')
const babel = require('babel-core')
const t = require('babel-types'); // types就是用来构造一个新的node节点的

const visitor = {

  // 处理import组件导出，生成相对应的components节点
  ImportDeclaration(path) {
    if (path.node.source.value.indexOf('iscomponents') > -1) {
      const value = path.node.source.value.replace('iscomponents', '')
      path.replaceWith(t.ImportDeclaration(path.node.specifiers, t.stringLiteral(value)))

      const componentsName = path.node.specifiers[0].local.name
      let exportDefaultPath = path.container.find(k => {
        return k.type == 'ExpressionStatement'
      })

      const { properties } = exportDefaultPath.expression.arguments[0];

      // 根节点是否存在components
      const isKey = properties.findIndex(props => {
        return props.key.name == 'components'
      })

      if (isKey == -1) {
        properties.push(
          t.ObjectProperty(
            t.identifier('components'), t.ObjectExpression([
              t.objectProperty(t.identifier(componentsName), t.identifier(componentsName))
            ])
          )
        )
      } else {
        properties[isKey].value.properties.push(
          t.objectProperty(t.identifier(componentsName), t.identifier(componentsName))
        )
      }
    }
  },

  ObjectProperty(path) {
    // 处理data
    if (path.get('key').isIdentifier({ 'name': 'data' })) {
      const { value: { properties } } = path.node
      path.replaceWith(
        t.objectMethod('method', t.Identifier('data'), [], t.blockStatement([
          t.returnStatement(t.ObjectExpression(properties))
        ]))
      )
    }
    // 处理props 
    if (path.get('key').isIdentifier({ 'name': 'props' }) || path.get('key').isIdentifier({ 'name': 'properties' })) {
      const childObjectProperty = path.get('value').get('properties')
      childObjectProperty.forEach(item => {
        const childProp = item.get('value').get('properties')
        childProp.forEach(child => {
          // 处理watch
          if (child.get('key').isIdentifier({ 'name': 'observer' })) {
            const isKey = path.container.findIndex(props => {
              return props.key.name == 'watch'
            })
            const { params, body } = child.node
            const keyName = child.parentPath.container.key.name
            if (isKey == -1) {
              path.container.push(
                t.ObjectProperty(
                  t.identifier('watch'), t.ObjectExpression([
                    createdObjPropery()
                  ])
                )
              )
            } else {
              path.container[isKey].value.properties.push(
                createdObjPropery()
              )
            }

            // 拷贝一下path下的方法
            function createdObjPropery() {
              // 这里不能用箭头函数会有作用域的问题
              return t.ObjectProperty(
                t.identifier(keyName), t.FunctionExpression(null, params, body)
              )
            }
          } else {

          }
        })
      })
    }
  },
  // 方法
  CallExpression(path) {
    // 重写this.setData => this.xx = xx
    if (path.get('callee').get('object').isThisExpression()) {
      let parent = path.findParent(path => path.isBlockStatement())
      parent.node.body.push(
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.thisExpression(), t.identifier('a')),
            t.numericLiteral(1)
          )
        )
      )
    }
  },
  // 检索Page()，主要拿到当前小程序的组件重载方法
  // 例如： ybfCompoents()  ybfCompoents是导入对象，需要删除
  ExpressionStatement(path) {
    if (path.parentPath.node.type == 'Program') {
      if (path.node.expression.type !== 'CallExpression') return
      const pathExpressName = path.node.expression.callee.name
      const containter = path.container
      containter.forEach((child, key) => {
        if (child.type == 'ImportDeclaration') {
          child.specifiers.forEach((sepc, sepcKey) => {
            if ((sepc.type == 'ImportSpecifier' || sepc.type == 'ImportDefaultSpecifier') && sepc.local.name == pathExpressName) {
              // 移除引入
              child.specifiers.splice(sepcKey, 1)
            }
          })
          if (child.specifiers.length == 0) {
            // 移除import
            containter.splice(key, 1)
          }
        }
      })
      path.replaceWith(t.exportDefaultDeclaration(path.node.expression.arguments[0]))
    }
  }
  // 处理对象节点
  // ObjectExpression(path) {
  //   const pathCon = path.container
  //   // 调整 data: {}  转换为 data: () => {}
  //   if (pathCon.key && pathCon.key.name == 'data') {
  //     const { value: { properties } } = pathCon
  //     path.replaceWith(
  //       t.ArrowFunctionExpression([], t.BlockStatement([
  //         t.ReturnStatement(t.ObjectExpression(properties))
  //       ]))
  //     )
  //   }
  //   // 调整props初始化
  //   if (pathCon.key && (pathCon.key.name == 'props' || pathCon.key.name == 'properties')) {
  //     // 遍历循环props的初始化值 将 value: [] 转换为  default: () => []
  //     const { properties } = path.node

  //     // 以下变量是判断小程序props下是否存在value 防止内存爆栈
  //     // TODO:这里移动observe之前，重写内部this.setData为this.XXX
  //     let isHasValue = false
  //     properties.forEach(pro => {
  //       if (pro.value.type !== 'Identifier') {
  //         // 后面需要针对number 和props 进行一些变量提前判断
  //         // 例如： Number的类型不能为 '1'
  //         pro.value.properties.forEach((child, key) => {
  //           if (child.type == 'ObjectProperty' && child.key.name == 'value') {
  //             let returnParamsType = null
  //             if (child.value.type == 'ArrayExpression') {
  //               returnParamsType = t.arrayExpression()
  //             } else if (child.value.type == 'BlockStatement') {
  //               returnParamsType = t.blockStatement()
  //             } else if (child.value.type == 'StringLiteral') {
  //               returnParamsType = t.identifier(child.value.extra.raw)
  //             } else if (child.value.type == 'NumericLiteral') {
  //               returnParamsType = t.identifier(child.value.value)
  //             } else if (child.value.type == 'BooleanLiteral') {
  //               returnParamsType = t.identifier(child.value.value + '\n')
  //             } else if (child.value.type == 'ObjectExpression') {
  //               returnParamsType = t.blockStatement([t.returnStatement(t.objectExpression(child.value.properties))])
  //               returnParamsType = t.ArrowFunctionExpression([], returnParamsType)
  //             }
  //             pro.value.properties[key] = t.objectProperty(
  //               t.identifier('default'),
  //               returnParamsType,
  //               false
  //             )
  //             isHasValue = true
  //           } else if (child.type === 'ObjectMethod' && child.key.name == 'observer') {
  //             createdWatchByProps(child, pro.key.name, path)
  //             // pro.value.properties.splice(key, 1)
  //           }
  //         })
  //       }
  //     })
  //     if (isHasValue) {
  //       path.replaceWith(t.ObjectExpression(properties))
  //     }
  //   }
  // },

}

function toggle(str) {
  const result = babel.transform(str, {
    plugins: [
      { visitor }
    ],
  })
  let content = result.code.trim()
  console.log(content)
  // console.log(result.code.trim())
}

// 获取小程序props组件下的observer 组成watch方法
function createdWatchByProps(nowPath, keyName, path) {
  const { params, body } = nowPath
  let exportDefaultPath = path.getStatementParent();
  const { declaration: { properties } } = exportDefaultPath.node

  // 根节点是否存在watch
  const isKey = properties.findIndex(props => {
    return props.key.name == 'watch'
  })

  if (isKey == -1) {
    properties.push(
      t.ObjectProperty(
        t.identifier('watch'), t.ObjectExpression([
          createdObjPropery()
        ])
      )
    )
  } else {
    properties[isKey].value.properties.push(
      createdObjPropery()
    )
  }

  // 拷贝一下path下的方法
  function createdObjPropery() {
    // 这里不能用箭头函数会有作用域的问题
    return t.ObjectProperty(
      t.identifier(keyName), t.FunctionExpression(null, params, body)
    )
  }

  // path.remove()
}

// json文件追加进js
function toggleJsonToStr(nowFile, jsonFileStr) {

  const json = JSON.parse(jsonFileStr)
  const comp = json.usingComponents
  if (Object.keys(comp).length == 0) return nowFile
  const importArr = []
  for (const i in comp) {
    let splitd = comp[i].split('/')
    // TODO: webpack 允许开发者自己配置别名

    // 这里只处理了常规的路径别名，需要对外扩展允许自己加别名配置
    splitd[0] = 'iscomponents@' + splitd[1]
    splitd.splice(1, 1)
    // 读取的是json 加个字段iscomponents标识当前是组件，主要是为了区别页面上引用的
    // import sss from 'xx' 方法
    importArr.push(`import ${toHump(i)} from '${splitd.join('/')}'`)
  }
  // 追加一个空，让export default 直接换行
  importArr.push('')
  nowFile = nowFile.slice(-1, 0) + importArr.join('\n') + nowFile.slice(0)
  return nowFile
}


function getType(obj) {
  let type = typeof obj;
  if (type != "object") {
    return type;
  }
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}

function toHump(name) {
  return name.replace(/\-(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  }).replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  })
}


module.exports = {
  toggle,
  toggleJsonToStr
}