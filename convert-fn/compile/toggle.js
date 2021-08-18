const { compoentsConfig } = require('../config')
const fs = require('fs')
const babel = require('babel-core')
const t = require('babel-types'); // types就是用来构造一个新的node节点的

// TODO: 需要处理小程序externalClasses 暂时只处理 custom-class
// TODO: 需要处理import进来的节点，对内部代码进行处理 ？？？

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
  // 处理data properties behaviors 等生命周期
  ObjectProperty(path) {
    if (path.get('key').isIdentifier({ 'name': 'data' })) {
      const { value: { properties } } = path.node
      path.replaceWith(
        t.objectMethod('method', t.Identifier('data'), [], t.blockStatement([
          t.returnStatement(t.ObjectExpression(properties))
        ]))
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
  },
}
// 处理小程序props
const visitorWatch = {
  ObjectProperty(path) {
    if (path.get('key').isIdentifier({ 'name': 'props' }) || path.get('key').isIdentifier({ 'name': 'properties' })) {
      const childObjectProperty = path.get('value').get('properties')
      childObjectProperty.forEach(item => {
        const childProp = item.get('value').get('properties')
        childProp.length > 0 && childProp.forEach(child => {
          // 处理watch
          // TODO: watch 问题需要深拷贝,  immediate: true,
          if (child.get('key').isIdentifier({ 'name': 'observer' })) {
            const keyName = child.parentPath.container.key.name
            createdWatchByProps(child, keyName, path)
          }
          // 处理props下的value值转换为default
          else if (child.node.type == 'ObjectProperty' && child.node.key.name == 'value') {
            let returnParamsType = null
            let { value } = child.node
            if (value.type == 'ArrayExpression') {
              returnParamsType = t.arrayExpression()
            } else if (value.type == 'BlockStatement') {
              returnParamsType = t.blockStatement()
            } else if (value.type == 'StringLiteral') {
              returnParamsType = t.identifier(value.extra.raw)
            } else if (value.type == 'NumericLiteral') {
              returnParamsType = t.identifier(value.value)
            } else if (value.type == 'BooleanLiteral') {
              returnParamsType = t.identifier(value.value + '\n')
            } else if (value.type == 'ObjectExpression') {
              returnParamsType = t.blockStatement([t.returnStatement(t.objectExpression(value.properties))])
              returnParamsType = t.ArrowFunctionExpression([], returnParamsType)
            } else if (value.type == 'ArrowFunctionExpression') {
              return
            }
            child.replaceWith(t.objectProperty(
              t.identifier('default'),
              returnParamsType,
              false
            ))
          }
        })
      })
    }
  }
}
// 处理this.setData({}) 只考虑 this.setData({}, () => {}) 这种回调，其他不考虑
const visitorData = {
  CallExpression(path) {
    if (path.get('callee').get('object').isThisExpression()) {
      let arguments = path.get('arguments')
      arguments.forEach(ar => {
        if (ar.get('type').node == 'ArrowFunctionExpression' || ar.get('type').node == 'FunctionExpression') {
          const parentExpressionStatement = path.findParent(path => path.isExpressionStatement())
          ar.get('body').get('body.0').container.forEach(ex => {
            parentExpressionStatement.insertAfter(ex)
          })
        } else if (ar.get('type').node === 'ObjectExpression' && path.get('callee').get('property').isIdentifier({ "name": "setData" })) {
          const parentExpressionStatement = path.findParent(path => path.isExpressionStatement())
          ar.get('properties').forEach(pro => {
            parentExpressionStatement.insertBefore(
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(t.thisExpression(), t.identifier(pro.node.key.name)),
                  pro.node.value
                )
              )
            )
          })
        }
      })
    }
  }
}
// 删除setData() {}
const visitorDelData = {
  CallExpression(path) {
    if (path.get('callee').get('object').isThisExpression() && path.get('callee').get('property').isIdentifier({ name: 'setData' })) {
      let parent = path.findParent(path => path.isExpressionStatement())
      parent.remove()
    }
  }
}

// 转换小程序和vue的生命周期
const traverseJsVisitor = {
  Identifier(path) {
    // const { metadata } = path.hub.file
    // 替换 props
    if (path.node.name === 'properties') {
      const name = t.identifier('props')
      path.replaceWith(name)
    }

    if (path && (path.node.name === 'created')) {
      const name = t.identifier('beforeCreate')
      path.replaceWith(name)
    }

    if (path && (path.node.name === 'attached' || path.node.name === 'onLoad')) {
      const name = t.identifier('created')
      path.replaceWith(name)
    }

    if (path && path.node.name === 'observers') {
      const name = t.identifier('watch')
      path.replaceWith(name)
    }


    if (path && (path.node.name === 'ready' || path.node.name === 'onReady')) {
      const name = t.identifier('mounted')
      path.replaceWith(name)
    }

    if (path && path.node.name === 'behaviors') {
      const name = t.identifier('mixins')
      path.replaceWith(name)
    }

    if (path && (path.node.name === 'detached' || path.node.name === 'onUnload')) {
      const name = t.identifier('destroyed')
      path.replaceWith(name)
    }
  }
}

/**
 * 转换JS
 * @param {文件str} str 
 * @param {文件路径} fpath 
 * return code
 */
function toggle(str, fpath) {
  try {
    let result = babel.transform(str, {
      plugins: [
        { visitor: traverseJsVisitor },
        { visitor },
        { visitor: visitorData },
        { visitor: visitorWatch },
        { visitor: visitorDelData }

      ],
    })
    let content = result.code.trim()
    return content
  } catch (e) {
    console.log(e)
  }
}

// 获取小程序props组件下的observer 组成watch方法
function createdWatchByProps(nowPath, keyName, path) {
  const isKey = path.container.findIndex(props => {
    return props.key.name == 'watch'
  })

  const { params, body } = nowPath.node
  if (isKey == -1) {
    let findCompoentsKey = path.container.findIndex(props => {
      return props.key.name == 'components'
    })
    findCompoentsKey = findCompoentsKey == -1 && path.container.length - 1 || findCompoentsKey

    path.getSibling(findCompoentsKey).insertBefore(t.ObjectProperty(
      t.identifier('watch'), t.ObjectExpression([
        createdObjPropery()
      ])
    ))
  } else {
    path.getSibling(isKey).node.value.properties.push(
      createdObjPropery()
    )
  }
  // 拷贝一下path下的方法
  function createdObjPropery() {
    return t.ObjectProperty(
      t.identifier(keyName), t.FunctionExpression(null, params, body)
    )
  }
  nowPath.remove()
}

// json文件追加进js

// TODO: 需要标识当前读取的json是否是component节点
function toggleJsonToStr(nowFile, jsonFileStr) {

  const json = JSON.parse(jsonFileStr)
  const comp = json.usingComponents
  // if (Object.keys(comp).length == 0) return nowFile
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

// template模板引入，可以考虑不支持，用组件代替
function toggleWxmlToStr(nowFile, wxmlFileStr, componentPath) {
  // 匹配删除所有wxs开头的标签
  const wxml = wxmlFileStr.match(/\<wxs.*\/\>/g)
  if (wxml) {
    for (let i = 0;i < wxml.length;i++) {
      let importModuleName = ''
      let fromValue = ''
      let moduleName = [...wxml[i].replace('/>', '').matchAll(/(\w+)="([\s\S]+?)"/g)]
      for (let d = 0;d < moduleName.length;d++) {
        if (moduleName[d][1] == 'module') {
          importModuleName = moduleName[d][2]
        } else if (moduleName[d][1] == 'src') {
          fromValue = moduleName[d][2]
        }
      }
      // global.nowFileCache.set(importModuleName, fromValue)
      // global.wechatWxsMapCache.setResolverPath(componentPath + '_' + importModuleName, fromValue)

      nowFile = nowFile.slice(-1, 0) + `import ${importModuleName} from "${fromValue}"\n` + nowFile.slice(0)
    }
  }

  wxmlFileStr = wxmlFileStr.replace(/\<wxs.*\/\>/g, '')

  return {
    wxmlFileStr,
    jsScriptFileStr: nowFile
  }
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
  toggleJsonToStr,
  toggleWxmlToStr
}