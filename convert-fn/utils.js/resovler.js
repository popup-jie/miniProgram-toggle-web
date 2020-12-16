// 记录文件路径cache
let fileUrlcache = new Map()

// 记录wxs方法所
// wxml: {{mns.tts()}} 
// =>
// import mns from '...'
// methods: {
//  tts(p){
//    return mns.tts(p)
//   }
// }


const resolver = () => {

  let localCache = {
    initCahe(fpath) {
      if (fileUrlcache.has(fpath)) {
        return fileUrlcache.get(fpath)
      }
      fileUrlcache.set(fpath, new Map())
      return fileUrlcache.get(fpath)
    },

    getResolverPath(fpath) {
      return fileUrlcache.get(fpath)
    },

    setResolverPath(fpath, values) {
      fileUrlcache.set(fpath, values)
    },

    getFileUrlcache() {
      return fileUrlcache
    }
  }

  return localCache
}



module.exports = {
  resolver
}