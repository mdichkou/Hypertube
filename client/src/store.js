import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: {
      id: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      avatar: '',
      lang: '',
    }
  },
  mutations: {
    userData: (state, payload) => {
      state.userData = payload
    },
  },
  actions: {
    userData: (context, payload) => {
      context.commit('userData', payload)
    },
  }
})
