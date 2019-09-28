<template>
  <div>
    <v-toolbar short>
      <v-toolbar-title class="toolbar">
          <a href="/home_page" class="hyper">
          <v-icon class="mb-1">local_movies</v-icon>
          <span class="grey--text">HYPER</span>
            <span>TUBE</span>
            </a>
      </v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-toolbar-items>
        <v-btn v-if="this.$route.name === 'signup' || this.$route.name === 'forgot'" @click="ToLogin" text>{{ $t('Login.login') }}</v-btn>
        <v-btn v-if="this.$route.name === 'login'" @click="ToSignup" text>{{ $t('Login.new') }}</v-btn>
        <v-divider vertical inset></v-divider>
        <v-btn text @click="ToEN">EN</v-btn>
        <v-divider vertical inset></v-divider>
        <v-btn text @click="ToFR">FR</v-btn>
      </v-toolbar-items>

    </v-toolbar>
  </div>
</template>

<script>
import i18n from '../i18n'

export default {
    data() {
        return {
            
        }
    },
    methods: {
      ToEN(){
        if (i18n.locale == 'fr')
        {
          this.$router.push({path: `/en/${this.$route.name}`})
          i18n.locale = 'en';
        }
      },
      ToFR() {
        if (i18n.locale == 'en')
        {
          this.$router.push({path: `/fr/${this.$route.name}`})
          i18n.locale = 'fr'
        }
      },
      ToSignup() {
        this.$router.push({path: `/${i18n.locale}/signup`})
      },
      ToLogin() {
        this.$router.push({path: `/${i18n.locale}/login`})
      }
    }
}
</script>
<style>
.toolbar{
   text-decoration:none;
     background:#fff;
     font-family: 'Orbitron';
     font-size: 20px !important;
     font-weight: bold
}
</style>