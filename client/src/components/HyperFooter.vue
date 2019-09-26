<template>
  <v-footer dark
    padless
  >
    <v-row justify="center" no-gutters>
      <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <div style="position:absolute;bottom:5px;right:15px;color:white">
            <v-btn color="white" text @click="ToEN" style="border-right: 1px solid white;border-radius:0px">EN</v-btn>
            <v-divider vertical inset color="white"></v-divider>
            <v-btn color="white" text @click="ToFR">FR</v-btn>
        </div>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
        <v-btn  v-for="link in links" :key="link.route" color="white" text class="my-2" :to="link.route" >
                {{ link.text }}
        </v-btn>
    <v-btn text style="position:absolute;bottom:5px;left:5px;color:white" > {{ new Date().getFullYear() }} — <strong>&copy;Hypertube</strong> </v-btn>
    </v-row>
  </v-footer>
</template>

<script>
import i18n from '../i18n'

export default {
    data: () => ({
      links: [
                { icon: 'person', text: 'Profile', route: `/profile` },
                { icon: 'home', text: 'Home', route: `/home` },
                { icon: 'settings', text: 'Settings', route: `/settings` },
        ],
      items: [
          {title: "EN"},
          {tile: "FR"}
      ]
    }),
    methods: {
        ToEN(){
            if (this.$route.params.lang == 'fr')
                this.$router.push({path: `/en/${this.$route.name}`})
            i18n.locale = 'en'
        },
        ToFR() {
            if (this.$route.params.lang == 'en')
                this.$router.push({path: `/fr/${this.$route.name}`})
            i18n.locale = 'fr'
        },
    },
  }
</script>