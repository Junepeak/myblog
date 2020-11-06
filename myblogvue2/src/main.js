// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'



// 引入 ElementUI 插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 以插件的方式应用到 Vue 
Vue.use(ElementUI);

// 引入封装后的 axios
import http from './assets/js/http.js'
Vue.use(http);

import moment from './assets/js/mymoment.js'
Vue.use(moment);
// import moment from 'moment'
// Vue.prototype.$moment = moment;

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 需要在具体的显示标签上添加 markdown-body 类，样式才会应用
Vue.use(mavonEditor);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 声明一个组件
  components: { App },
  // 声明一个模板，该模板的内容是上面生面的组件，也就是 App.vue 里的内容
  // 私有模板，会替换掉 el 引用的标签
  template: '<App/>'
})
