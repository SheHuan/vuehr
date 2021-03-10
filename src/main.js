import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
// 测试 iconfont class="iconfont icon-xxx"
import './assets/iconfont/iconfont.css'

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
    // 去的是登录页面
    if (to.path === '/') {
        next();
    } else {
        // 已经登录
        if (window.sessionStorage.getItem('user')) {
            // 开加载菜单数据的逻辑
            initMenu(router, store);
            next();
        } else {
            // 跳转到登录页
            // 这里会记录是从哪个页面跳转到登录页的，以便登录成功后重定向到该页面，而不是直接到home页面
            let path = to.path;
            next('/?redirect=' + path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
