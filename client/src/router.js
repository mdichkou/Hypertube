import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Registre from './views/Registre.vue'
import Login from './views/Login.vue'
import Forgot from './views/Forgot.vue'
import Settings from './views/Settings.vue'
import Profile from './views/Profile.vue'
import Video from './components/Video'
import SearchVue from './components/SearchVue'
import Streaming from './components/Stream'
import NOT from './components/404'
import i18n from './i18n'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
        {
          name: 'home',
          path: '/home',
          component: SearchVue
        },
        {
            name: 'stream',
            path: '/stream/:id/:hash',
            component: Streaming
        },
        {
            name: 'video',
            path: '/video/:id',
            component: Video
        },
        {
          path: '/login/:provider',
          name: 'ExtLogin', 
          component: Login
        },
        {
          path: '/settings',
          name: 'settings', 
          component: Settings
        },
        {
          path: '/profile',
          name: 'profile', 
          component: Profile
        },
        {
          path: '/profile/:id',
          name: 'VProfile', 
          component: Profile
        },
        {
          path: '*',
          component: NOT
        },
        {
          path: '/:lang',
          component: {
            render (c) {return c('router-view')}
          },
          children: [
            {
              path: 'signup',
              name: 'signup', 
              component: Registre
            },
            {
              path: 'login',
              name: 'login', 
              component: Login
            },
            {
              path: 'forgot',
              name: 'forgot', 
              component: Forgot
            },
          ]
        },
   ]
})

const   openRoutes = ['ExtLogin', 'login', 'signup', 'forgot']
const   langRoutes = ['login', 'signup', 'forgot']
//const   allRoutes = ['ExtLogin', 'login', 'signup', 'forgot', 'profile', 'settings', 'home']

router.beforeEach((to, from, next) => {
    if (langRoutes.includes(to.name))
    {
      let language = to.params.lang;
      if (language != 'fr' && language != 'en')
        language = 'en'
      if (i18n.locale != language)
        i18n.locale = language
    }
    if (openRoutes.includes(to.name) && !window.localStorage.token)
        next()
    else if (openRoutes.includes(to.name) && window.localStorage.token)
        next('/home')
    else if (window.localStorage.token)
        next()
    else
        next('en/login')
})

export default router;
