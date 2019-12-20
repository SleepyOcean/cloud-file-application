import Vue from 'vue'
import axios from 'axios'

import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import './style/common.scss'
import './style/soelement.scss'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI)

// 提交验证
Vue.directive('clickOutside', {
	// 初始化指令
	bind (el, binding, vnode) {
		function clickHandler (e) {
			// 这里判断点击的元素是否是本身，是本身，则返回
			if (el.contains(e.target)) {
				return false;
			}
			// 判断指令中是否绑定了函数
			if (binding.expression) {
				// 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
				binding.value(e);
			}
		}
		// 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
		el.__vueClickOutside__ = clickHandler;
		document.addEventListener('click', clickHandler);
	},
	update () {},
	unbind (el, binding) {
		// 解除事件监听
		document.removeEventListener('click', el.__vueClickOutside__);
		delete el.__vueClickOutside__;
	}
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
