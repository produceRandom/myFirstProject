import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import HelloA from "../components/HelloA"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
    	path:"/helloa",
    	component:HelloA
    }
  ]
})
