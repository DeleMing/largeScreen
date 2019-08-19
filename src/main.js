import "babel-polyfill"
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
// import store from '@/vuex/index'
// import  '@/js/config.js'
// import  '@/js/config.js'
// import  '@/js/test.js'
import  '@/css/main.less'
Vue.use(ElementUI);
Vue.use(require('vue-moment'));
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
