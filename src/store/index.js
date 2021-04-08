import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "@/utils/api";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

import {Notification} from 'element-ui';
import fa from "element-ui/src/locale/lang/fa";
import da from "element-ui/src/locale/lang/da";

Vue.use(Vuex)

const now = new Date();

const store = new Vuex.Store({
    state: {
        routes: [],
        // 聊天内容
        sessions: {},
        // 聊天用户列表
        hrs: [],
        // 当前选择的聊天用户
        destChatUser: null,
        // 当前登录用户
        currentHr: JSON.parse(window.sessionStorage.getItem('user')),
        filterKey: '',
        stomp: null,
        isDot: {}
    },
    mutations: {
        initRoutes(state, data) {
            state.routes = data
        },
        changeDestChatUser(state, session) {
            state.destChatUser = session;
            // 取消红点
            state.isDot[state.currentHr.username + '#' + session.username] = false;
        },
        // 处理消息发送后的逻辑
        addMessage(state, msg) {
            let message = state.sessions[state.currentHr.username + '#' + msg.to];
            if (!message) {
                // state.sessions[state.currentHr.username + '#' + msg.to] = [];
                Vue.set(state.sessions, state.currentHr.username + '#' + msg.to, [])
            }
            state.sessions[state.currentHr.username + '#' + msg.to].push({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf
            });
        },
        INIT_DATA(state) {
            // 浏览器本地的历史聊天记录这里在这里完成
            let data = localStorage.getItem('vue-chat-session');
            if (data) {
                state.sessions = JSON.parse(data);
            }
        },
        INIT_HR(state, data) {
            state.hrs = data;
            state.destChatUser = data[0];
        },
        INIT_CURRENT_HR(state, data) {
            state.currentHr = data;
        }
    },
    actions: {
        // 连接websocket
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'));
            context.state.stomp.connect({}, success => {
                context.state.stomp.subscribe('/user/queue/chat', msg => {
                    // 接收消息
                    let receiveMsg = JSON.parse(msg.body);
                    if (receiveMsg.from !== context.state.destChatUser.username) {
                        // 右下角通知
                        Notification.info({
                            title: '【' + receiveMsg.fromNickname + '】发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substring(0, 10) : receiveMsg.content,
                            position: 'bottom-right'
                        });
                        // 在聊天列表对应用户上显示红点
                        Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true);
                    }
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from;
                    context.commit('addMessage', receiveMsg)
                })
            }, error => {

            })
        },
        initData(context) {
            context.commit('INIT_DATA');
            // 请求聊天列表
            getRequest("/chat/hrs").then(resp => {
                if (resp) {
                    context.commit('INIT_HR', resp);
                }
            })
        }
    }
})

store.watch(function (state) {
    return state.sessions
}, function (val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
}, {
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;