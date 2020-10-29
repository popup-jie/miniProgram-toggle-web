const path = require('path')
const fs = require('fs')
const { vueComponentsPath, vueTemplatePath } = require('../config')
// vue 路由组件路径
const _VueComponentsPath = path.join(__dirname, '../', vueComponentsPath)
// vue 路由模板
const filename = path.join(__dirname, '../', vueTemplatePath)

const { toggle, toggleJsonToStr, toggleWxmlToStr } = require('./toggle')
const { htmlToggle } = require('./parseHtml')

const wechatTowebapp = (map) => {
  for (let [key, value] of map.entries()) {
    let filePath = value[0].split('\\')
    filePath.pop()
     // 删除 /compoents 前的磁盘路径
    let startIndex = filePath.indexOf('components')
    filePath.splice(0, startIndex + 1)

   
    let componentspath = path.join(_VueComponentsPath, '/', filePath.join('//'))

    console.log(componentspath)
    fs.mkdir(componentspath, { recursive: true }, (err) => {
      let file = fs.readFileSync(filename, 'utf8');
      let jsScriptFileStr = ''

      // 判断当前是否有文件目录是否为小程序页面
      if (isWechatConfigPageOrCompoent(value)) {
        for (let i = 0;i < value.length;i++) {
          if (value[i].endsWith('.js')) {
            jsScriptFileStr = fs.readFileSync(value[i], 'utf8');
          } else if (value[i].endsWith('.json')) {
            let jsonFileStr = fs.readFileSync(value[i], 'utf8');
            jsScriptFileStr = toggleJsonToStr(jsScriptFileStr, jsonFileStr)
          } else if (value[i].endsWith('.scss')) {
            let nowFile = fs.readFileSync(value[i], 'utf8');
            file = file.replace('<!-- style -->', nowFile)
          } else if (value[i].endsWith('.wxml')) {
            // 这里主要是追加wxs标签，到小程序，调整成import引入方法
            let wxmlFileStr = fs.readFileSync(value[i], 'utf8');
            let returnNewFile = toggleWxmlToStr(jsScriptFileStr, wxmlFileStr)
            wxmlFileStr = returnNewFile.wxmlFileStr
            jsScriptFileStr = returnNewFile.jsScriptFileStr
            wxmlFileStr = htmlToggle(wxmlFileStr)
            file = file.replace('<!-- html -->', wxmlFileStr)
          }
        }
        jsScriptFileStr = toggle(jsScriptFileStr)
        file = file.replace('<!-- script -->', jsScriptFileStr || 'export default {}')
        // 处理js部分

        fs.writeFile(path.join(componentspath, '/', 'index.vue'), file, (err) => {
          if (err) {
            console.log(err)
          }
        })
      } else {
        for (let i = 0;i < value.length;i++) {
          let nowFile = fs.readFileSync(value[i], 'utf8');
        
          // 拿到当前文件名字，重写文件路径
          let filePath = value[i].split('\\')
          let _name = filePath.pop()

          
          fs.writeFile(path.join(componentspath, '/', _name), nowFile, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      }
    });

  }
}

// 判断是否是小程序页面，最少包含js wxml 和json
function isWechatConfigPageOrCompoent(value) {

  let fileName = ''
  const flgArr = value.map(va => {
    let lastFileName = va.split('\\').pop()
    const name = lastFileName.substring(0, lastFileName.lastIndexOf('.'))
    if (!fileName) {
      fileName = name
      return true
    } else if (fileName != name) {
      return false
    } else {
      return true
    }
  })


  return flgArr.filter(flg => {
    return flg === true
  }).length > 3

}


module.exports = { wechatTowebapp }