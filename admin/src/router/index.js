import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import List from '@/views/list'
import ListUser from '@/views/sys/user'
import Listrole from '@/views/sys/role'
import Listmenu from '@/views/sys/menu'
import Listconfig from '@/views/sys/config'
import Listjob from '@/views/job/schedule'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Longin',
      component:  Login 
    },
    {
      path: '/list',
      name: 'List',
      component:  List ,
      children:[
        {
          path: 'sys/user',
        name: 'listuser',
        component:  ListUser
        },
        {
          path: 'sys/role',
        name: 'listrole',
        component:  Listrole
        },
        {
          path: 'sys/menu',
        name: 'listmenu',
        component:  Listmenu
        },
        {
          path: 'sys/config',
        name: 'listconfig',
        component:  Listconfig
        },
        {
          path: 'job/schedule',
        name: 'listjob',
        component:  Listjob
        },
      ],
    }
  ]
})
