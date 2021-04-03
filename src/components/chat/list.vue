<template>
  <div id="list">
    <ul style="padding-left: 0">
      <li v-for="item in hrs" :class="{ active: destChatUser?item.username === destChatUser.username:false }"
          v-on:click="changeDestChatUser(item)">
        <img class="avatar" :src="item.userface" :alt="item.name">
        <el-badge :is-dot="isDot[currentHr.username+'#'+ item.username]"><p class="name">{{ item.name }}</p></el-badge>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data() {
    return {}
  },
  computed: mapState([
    'hrs',
    'currentHr',
    'isDot',
    'destChatUser'
  ]),
  methods: {
    changeDestChatUser: function (session) {
      this.$store.commit('changeDestChatUser', session)
    }
  }
}
</script>

<style lang="scss" scoped>
#list {
  li {
    padding: 15px 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;
    list-style: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  li.active { /*注意这个是.不是冒号:*/
    background-color: rgba(255, 255, 255, 0.1);
  }

  .avatar {
    border-radius: 2px;
    width: 30px;
    height: 30px;
    vertical-align: middle;
  }

  .name {
    display: inline-block;
    margin: 0 15px 0 0;
  }
}
</style>
