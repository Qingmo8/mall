import Vue from 'vue'
import Vuex from 'vuex'

import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

//1.安装插件
Vue.use(Vuex)

const state = {
  cartList: []
}

//2.创建store对象
const store = new Vuex.Store({
  state,

  //数组常用的方法{push/pop/unshift/shift/sort/reverse/map/reduce}
  mutations,
  actions,
  getters
})

//3.挂载Vue实例上
export default store