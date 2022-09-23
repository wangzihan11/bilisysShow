import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import JsonViewer from 'vue-json-viewer'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(ElementUI)
Vue.use(JsonViewer)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
