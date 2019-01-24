import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import store from './store'
import TimeEntries from './components/TimeEntries.vue'
import NewList from './components/NewList.vue'
import user from './components/user.vue'
import label from "./components/label.vue"

import App from './App'
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.css'



Vue.use(VueRouter)
Vue.use(VueResource)

const routes=[
	{
		path:'/',
		component:Home
	},
	{
		path:'/home',
		component:Home
	},
	{
		path:'/time-entries',
		component:TimeEntries,
		children:[{
			path:'log-time',
			component:reslove=>require(['./components/LogTime.vue'],reslove),
		}]
	},
	{
		path:'/new-list',
		component:NewList,
	},
	{
		path:'/user',
		component:user
	},
	{
		path:"/label",
		component:label
	}
	
];
const router=new VueRouter({
	routes
});


var app=new Vue({
	el:"#app",
	router,
	store,
	...App,
})

