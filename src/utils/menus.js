import {getRequest} from "@/utils/api";

function formatRoutes(routes) {
    let fmRoutes = [];
    routes.forEach(route => {
            let {path, component, name, iconCls, meta, children} = route;
            if (children && children instanceof Array) {
                children = formatRoutes(children);
            }

            // 异步加载的组件路径
            let dir = ''
            if (component.startsWith("Home")) {
                dir = component
            } else if (component.startsWith("Emp")) {
                dir = 'emp/'+ component
            } else if (component.startsWith("Per")) {
                dir = 'per/'+ component
            } else if (component.startsWith("Sal")) {
                dir = 'sal/'+ component
            } else if (component.startsWith("Sta")) {
                dir = 'sta/'+ component
            } else if (component.startsWith("Sys")) {
                dir = 'sys/'+ component
            }

            let fmRoute = {
                path: path,
                name: name,
                iconCls: iconCls,
                mata: meta,
                children: children,
                component: () => import('../views/' + dir + '.vue')
                // component(resolve) {
                //         require(['../views/' + dir + '.vue'], resolve);
                // }
            };

            fmRoutes.push(fmRoute);
        }
    )
    return fmRoutes;
}

export const initMenu = (router, store) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxx')
    // 已经有菜单数据了
    if (store.state.routes.length > 0) {
        return;
    }
    console.log('yyyyyyyyyyyyyyyyyyyyy')
    getRequest('/system/config/menu').then(data => {
        if (data) {
            let fmRoutes = formatRoutes(data);
            fmRoutes.forEach(route=>{
                router.addRoute(route);
            })
            // 更新vuex中的菜单数据，store/index.js
            store.commit('initRoutes', fmRoutes)
        }
    })
}