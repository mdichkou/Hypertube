import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
 state: {
   userData: {
     first_name: '',
     last_name: '',
     username: '',
     email: '',
     password: '',
     avatar: '',
   },
   data: []
 },
 mutations: {
   userData: (state, payload) => {
     state.userData = payload
   },
   dataShare: (state, payload) => {
    state.data = payload
  },
 },
 actions: {
   userData: (context, payload) => {
     context.commit('userData', payload)
   },
   dataShare:  (context, payload) => {
    context.commit('dataShare', payload)
  },
 }
})