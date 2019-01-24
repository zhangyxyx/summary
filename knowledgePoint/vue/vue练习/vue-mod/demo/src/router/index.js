import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello'
import Test from '../components/test'
import Main from '../components/main'
import Testchild from "../components/testchild"
 
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
    	path:'/test',
    	component:Test,
      children:[{
        path:'/main/testchild',
        component:Testchild,
      }]
    	
    },
    {
    	path:'/main',
    	name:'Main',
    	component:Main,
    },
    

  ]
})
