/*
 * @Description: 
 * @Version: 2.0
 * @Autor: popup
 * @Date: 2020-08-20 19:25:48
 * @LastEditors: popup
 * @LastEditTime: 2020-09-19 20:08:31
 */
// /src/main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'


Vue.config.productionTip = false

const appOptions = {
  el: '#microApp',
  router,
  render: h => h(App)
}

// 支持应用独立运行、部署，不依赖于基座应用
if (!window.singleSpaNavigate) {
  delete appOptions.el
  new Vue(appOptions).$mount('#app')
}

// 基于基座应用，导出生命周期函数
const vueLifecycle = singleSpaVue({
  Vue,
  appOptions
})

export function bootstrap(props) {
  console.log('app1 bootstrap')
  return vueLifecycle.bootstrap(() => { })
}

export function mount(props) {
  console.log('app1 mount')
  return vueLifecycle.mount(() => { })
}

export function unmount(props) {
  console.log('app1 unmount')
  return vueLifecycle.unmount(() => { })
}
