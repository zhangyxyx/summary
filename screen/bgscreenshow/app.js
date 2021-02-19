import Vue from 'vue'
import 'directive'
import $ from 'jquery'
import 'font-awesome/scss/font-awesome.scss'
import 'normalize.css/normalize.css'
import 'assets/css/element-theme/default/index.css'
import 'assets/css/global.scss'
import UnitechsUI from 'unitechs-ui'
import UnitechsJs from 'unitechs-js'
import baseParam from 'assets/js/baseParam'
import i18n from 'assets/js/i18n'
import commonMixins from 'assets/js/mixins/commonMixin'
import themePlugin from 'assets/js/plugins/themePlugin'
import 'components/common'
import App from './app.vue'
import Bus from 'assets/js/bus.js'
import $cookie from 'jquery.cookie'
import * as echarts from 'echarts';//引入echarts
Vue.prototype.$echarts = echarts //引入组件

Vue.prototype.$ = $
Vue.prototype.$cookie = $cookie
Vue.prototype.Bus=Bus
Vue.use(UnitechsUI, { size: 'mini', i18n: (key, value) => i18n.t(key, value) })
Vue.use(UnitechsJs, baseParam)
Vue.use(themePlugin)
Vue.mixin(commonMixins)

const vue = new Vue({
  el: '#app',
  i18n,
  render: h => h(App),
})
window.$vm = vue
document.title = "展示布局"
