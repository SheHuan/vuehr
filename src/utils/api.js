import axios from 'axios';
import qs from 'qs'
import {Message} from 'element-ui'
import router from "../router";

// 响应拦截器
axios.interceptors.response
    .use(success => {
        if (success.status && success.status === 200 && success.data.status === 500) {
            Message.error({message: success.data.msg});
            return;
        }
        if (success.data.msg) {
            Message.success(success.data.msg);
        }
        return success.data;
    }, error => {
        if (error.response.status === 504 || error.response.status === 404) {
            Message.error('服务器被吃了o(╯□╰)o');
        } else if (error.response.status === 403) {
            Message.error('权限不足，请联系管理员');
        } else if (error.response.status === 401) {
            // 前端session不可用时跳转到登录页面（session正常过期、后端重启）
            Message.error('尚未登录，请先登录');
            router.replace('/');
        } else {
            if (error.response.data.msg) {
                Message.error(error.response.data.msg);
            } else {
                Message.error('未知错误');
            }
        }
        return;
    })

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: qs.stringify(params),
        // transformRequest: [function (data) {
        //     // 数据默认会以json格式传递，需要转成key-value
        //     let ret = '';
        //     for (let i in data) {
        //         ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
        //     }
        //     return ret;
        // }],
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}