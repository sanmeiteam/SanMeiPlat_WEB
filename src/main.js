import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import {default as api} from './utils/api'
import {hasPermission} from "./utils/hasPermission";
import Blob from './excel/Blob.js';
import Export2Excel from './excel/Export2Excel.js';
//import 'lib-flexible'  ///移动端分辨率自适应  插件


//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import '@/styles/index.scss' // global css
Vue.use(VueQuillEditor)

//获取移动设备信息
//import md from 'mobile-detect'

Vue.use(ElementUI, {locale})
Vue.prototype.api = api
//全局的常量
Vue.prototype.hasPerm = hasPermission
//生产环境时自动设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = (process.env.NODE_ENV != 'production')
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

