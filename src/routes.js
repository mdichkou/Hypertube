import SearchVue from './components/SearchVue.vue'
import Streaming from './components/Stream'
import vue from 'vue'
import Router from 'vue-router'

vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            name: 'home',
            path:  '/',
            component:  SearchVue
        },
        {
            name: 'stream',
            path:  '/stream/:year/:name',
            component:  Streaming
        },
    ]
})

export default router