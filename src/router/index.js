import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import FriendChat from "@/views/chat/FriendChat";
import HrInfo from "@/views/HrInfo";
import Test1 from "../views/Test1";
import Test2 from "../views/Test2";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        hidden: true
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        hidden: true,
        children: [
            {
                path: '/chat',
                name: '在线聊天',
                component: FriendChat,
                hidden: true
            },
            {
                path: '/hrInfo',
                name: '个人中心',
                component: HrInfo,
                hidden: true
            }
        ]
    },
    // {
    //     path: '/home',
    //     name: 'Home',
    //     component: Home,
    //     children: [
    //         {
    //             path: '/test1',
    //             name: 'Test1',
    //             component: Test1
    //         },
    //         {
    //             path: '/test2',
    //             name: 'Test2',
    //             component: Test2
    //         }
    //     ]
    // }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    routes
})

export default router
