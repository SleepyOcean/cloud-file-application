import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'file-system',
      component: require('@/components/FileSystem').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
