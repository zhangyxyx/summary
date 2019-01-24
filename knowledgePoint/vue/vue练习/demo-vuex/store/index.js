//定义vuex的属性值，mutation对象函数等
//文件都会汇聚到这个地方，也是
//创建store对象的地方，就像store的入口一样
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './action';
import * as mutations from './mutations';
import * as getters from './getters';
import state from './rootState';

Vue.use(Vuex)
const store=new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})

export default store

/*
1.在rootstate中设置msg的初始化的数值，并且将state暴露
来
2.在action中设置一个函数，函数的作用是将要修改的值发送
到nutations中
3.在mutations中修改state.msg的值




*/



















