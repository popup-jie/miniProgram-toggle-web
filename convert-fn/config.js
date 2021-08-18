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

// 输出目录
const outPath = 'build'

// vue组件地址
const vueComponentsPath = '../build'

// vue模板文件地址
const vueTemplatePath = './vueTemplate/vue'

// 输入目录
const miniProgramPath = '../wechat/components/test'


module.exports = {
  compoentsConfig,
  pageConfig,
  vueComponentsPath,
  vueTemplatePath,
  miniProgramPath,
  outPath
}