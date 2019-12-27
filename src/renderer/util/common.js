import Vue from 'vue';

let util = {};
/**
 * 该obj对象不参与vue的监听
 */
const pseudo = Vue.observable({});
util.noneWatch = (obj) => {
	if (obj && typeof obj === 'object') {
		try {
			!obj.__ob__ && Object.defineProperty(obj, '__ob__', {
				value: pseudo.__ob__
			});
		} catch (e) {
			console.error(e.message);
		}
	}
	return obj;
};

export default util;
