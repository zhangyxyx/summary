import Vue from 'vue'
import Router from 'vue-router'
import demo from '../components/demo-vuex'
import demo2 from '../components/demo-vuex2'
 
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: demo
    },
    {
    	path:'/demo2',
      name:'demo2',
    	component:demo2
    },
  
  ]
})
