import Vue from 'vue'
import Router from 'vue-router'
import Tab from '@/components/tab'
import Tree from '@/components/tree'
import home from '@/components/home'
import Page from '@/components/page'
import navMenu from '@/components/navmenu'
import createHtml from '@/components/createHtml'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/home/',
    },
    {
      path:'/home',
      name:'home',
      component:home,
      children:[
        {
          path:'tab',
          name:'tab',
          component:Tab
        },
        {
          path:'tree',
          name:'tree',
          component:Tree
        },
        {
          path:'page',
          name:'page',
          component:Page
        },
        {
          path:'navMenu',
          name:'navMenu',
          component:navMenu
        },    {
          path:'createHtml',
          name:'createHtml',
          component:createHtml
        }
      ]
    }
  ]
})
