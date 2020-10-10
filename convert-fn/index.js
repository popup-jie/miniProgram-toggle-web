const path = require('path')
const { miniProgramPath } = require('./config')
const { getFileMap } = require('./getFileMap')
const { wechatTowebapp } = require('./compile/index')
var pathName = path.resolve(__dirname, miniProgramPath);
// 将小程序文件与目录同
let dirs = getFileMap(pathName)

// 编译map 生成webapp
wechatTowebapp(dirs)
