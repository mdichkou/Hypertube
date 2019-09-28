<template>
  <v-container fill-height fluid grid-list-xl>
    <v-row>
      <v-col cols="4" offset="4">
        <v-card>
          <v-card-title class="info white--text subheading" primary-title>
            <span class="title">Oops</span>
          </v-card-title>
          <v-card-text class="display-1 ma-7 text-center">
            404. There is no page here.
          </v-card-text>
          <v-card-actions>
            <v-btn text block class="info darken-3 white--text" to="/home">
              <v-icon left v-text="'mdi-arrow-left'" />
              Back
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>