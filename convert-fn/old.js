const fs = require('fs')
const path = require('path');
const { POINT_CONVERSION_COMPRESSED } = require('constants');


// vue 路由组件路径
const vueComponentsPath = path.resolve(__dirname, '../src/components')
// vue 路由模板
const filename = path.resolve(__dirname, './vueTemplate/vue')
const file = fs.readFileSync(filename, 'utf8');

// 文件对象map
const dirs = new Map()

// 小程序路由组件
var pathName = path.resolve(__dirname, './components');

function readDdir(pathName) {
  let files = fs.readdirSync(pathName)
  for (var i = 0;i < files.length;i++) {
    const newPath = path.join(pathName, files[i])
    let statDdir = fs.statSync(newPath)
    if (statDdir.isDirectory()) {
      readDdir(newPath)
    } else {
      let pathArr = newPath.split('\\')
      let file = pathArr.pop()
      // 
      if (file.endsWith('.js') || file.endsWith('.wxml') || file.endsWith('.wxss') || file.endsWith('.scss') || file.endsWith('.json')) {
        // 拿到当前文件路径最后一个下标
        let lastIndex = pathArr.length - 1

        let nowDdirName = pathArr[lastIndex]

        let parentDdirChildName = pathArr[--lastIndex]

        if (parentDdirChildName != 'components') {

          if (dirs.has(parentDdirChildName)) {
            let ddirValue = dirs.get(parentDdirChildName)
            let isHasKey = false

            for (let key of ddirValue.values()) {
              if (typeof key !== 'string') {
                if (key.keys == nowDdirName) {
                  isHasKey = true
                  key.value.push(newPath)
                }
              }
            }

            if (!isHasKey) {
              ddirValue.push({ keys: nowDdirName, value: [newPath] })
            }
          } else {
            let isHas = false
            while (!dirs.has(parentDdirChildName) && parentDdirChildName !== 'components') {
              lastIndex--
              isHas = true
              parentDdirChildName = pathArr[lastIndex]
            }

            if (!nowDdirName.endsWith('.js') && !isHas) {
              let newMap = new Map()
              newMap.set(nowDdirName, [newPath])
              dirs.set(parentDdirChildName, newMap)
            } else {
              let ddirValue = dirs.get(parentDdirChildName)
              let isHasKey = false

              function findParent(mkdirName) {
                if (mkdirName.indexOf('.js')) {
                  return false
                }

                for (let key of ddirValue.values()) {
                  if (typeof key !== 'string') {
                    if (key.keys == parentDdirChildName) {
                      isHasKey = true
                      key.value.push(newPath)
                    }
                  } else {
                    if ()
                  }
                }
              }

             

              if (!isHasKey) {
                ddirValue.push({ keys: nowDdirName, value: [newPath] })
              }
            }

          }

        } else {

          if (dirs.has(nowDdirName)) {
            const ddirValue = dirs.get(nowDdirName)
            // 当前文件是否是js文件
            ddirValue.push(newPath)
          } else {
            dirs.set(nowDdirName, [newPath])
          }
        }
      }
    }
  }
}
// 将组件目录，重组成组件需要的对象
readDdir(pathName)
console.log(dirs)
// MapForEach(dirs)

function MapForEach(map) {
  for (let [key, value] of map.entries()) {
    let compoentpath = path.join(vueComponentsPath, '/', key)
    fs.mkdir(compoentpath, { recursive: true }, (err) => {

    });
    // value.forEach(val => { })
  }
}


function readFile(path) {
  const file = fs.readFileSync(path, 'utf8');
  console.log(file)
}

function isStat(pathName, files) {
  return fs.lstatSync(pathName).isDirectory()
}