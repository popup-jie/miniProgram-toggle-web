// 组件生命周期
const compoentsConfig = {
  data: 'data',
  props: 'properties',
  mixins: 'behaviors',
  methods: 'methods',
  beforeCreate: 'created',
  created: 'attached',
  mounted: 'ready',
  relations: 'relations',
  destroyed: 'detached',
  classes: 'externalClasses'
}

// 页面生命周期
const pageConfig = {
  data: 'data',
  created: 'onLoad',
  beforeMount: 'onShow',
  mounted: 'onReady',
  // beforeDestroy: 'onHide',
  destroyed: 'onUnload'
}

// vue组件地址
const vueCompoentsPath = '../src/components'

// vue模板文件地址
const vueTemplatePath = './vueTemplate/vue'

// 小程序路由组件
const miniProgramPath = '../wechat/components'


module.exports = {
  compoentsConfig,
  pageConfig,
  vueCompoentsPath,
  vueTemplatePath,
  miniProgramPath
}