<template>
    <v-app>
      <Hyperbar v-if="this.$route.name !== 'login' && this.$route.name !== 'ExtLogin' && this.$route.name !== 'signup' && this.$route.name !== 'forgot'"/>
      <navbar v-else-if="this.$route.name !== 'ExtLogin'"/>
      <router-view />
      <HypFooter v-if="this.$route.name !== 'login' && this.$route.name !== 'ExtLogin' && this.$route.name !== 'signup' && this.$route.name !== 'forgot'"/>
    </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import Hyperbar from './components/HyperBar'
import HypFooter from './components/HyperFooter'

export default {
  name: 'App',
  components: {
    HypFooter,
    Navbar,
    Hyperbar
  },
  data: () => ({
    //
  }),
};
</script>
