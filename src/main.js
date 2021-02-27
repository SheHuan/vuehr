import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'

import {postKeyValueRequest, postRequest, putRequest, getRequest, deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false

Vue.use(ElementUI);

// 全局前置导航守卫
router.beforeEach((to, from, next) => {
    console.log(to);
    console.log(from);
    if (to.path === '/') {
        next();
    } else {
        // 开加载菜单数据的逻辑
        initMenu(router, store);
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
