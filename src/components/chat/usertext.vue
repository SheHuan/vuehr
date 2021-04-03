<template>
  <div id="uesrtext">
    <textarea autofocus v-model="content" v-on:keyup="sendMessage1"></textarea>
    <div>
      <span>Enter发送，Ctrl + Enter换行</span>
      <button :disabled="content.length===0"
              v-bind:class="content.length===0?'btn-disable':'btn-enable'" @click="sendMessage2">发送
      </button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'uesrtext',
  data() {
    return {
      content: ''
    }
  },
  computed: mapState([
    'destChatUser'
  ]),
  methods: {
    sendMessage1(e) {
      if (e.ctrlKey && e.keyCode === 13 && this.content.length) {
        this.content += '\r\n';
        return;
      }

      if (e.keyCode === 13 && this.content.length) {
        this.sendMessage2();
      }
    },
    sendMessage2() {
      let msg = {};
      msg.to = this.destChatUser.username;
      msg.content = this.content;
      this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msg));
      this.$store.commit('addMessage', msg);
      this.content = '';
    }
  }
}
</script>

<style lang="scss" scoped>
#uesrtext {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #dddddd;

  > textarea {
    display: block;
    padding: 10px;
    width: 100%;
    height: 75%;
    font-size: 14px;
    box-sizing: border-box;
    resize: none;
    border: none;
    outline: none;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 25%;
    line-height: 25%;
    text-align: end;
    background: white;
    vertical-align: middle;

    span {
      font-size: 12px;
      color: gray;
    }

    button {
      border: none;
      outline: none;
      color: white;
      padding: 5px 10px;
      font-size: 12px;
      border-radius: 5px;
      margin: 0 10px;
    }

    .btn-disable {
      background: #409eff;
      opacity: 0.5;
    }

    .btn-enable {
      background: #409eff
    }
  }
}
</style>
