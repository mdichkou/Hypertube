<template>
  <v-row>
    <v-col v-for="(movie,index) in data.slice(pStart, pEnd)" :key="index" lg="6" md="6">
      <v-card :loading="loading" class="mx-auto my-12" max-width="374">
        <v-img v-if="movie.medium_cover_image" height="250" :src="movie.medium_cover_image"></v-img>
        <v-img v-else height="250" :src="defImage"></v-img>

        <v-card-title>{{movie.title}}</v-card-title>
        <!-- <v-card-title v-if="movie.media_type === 'tv'">{{movie.name}}</v-card-title> -->
        <v-card-text>
          <v-row align="center">
            <v-rating
              :value="movie.rating"
              color="amber"
              half-increments
              dense
              class="pl-3"
              size="14"
              readonly
            ></v-rating>

            <div class="grey--text pl-2">{{movie.rating}}</div>
          </v-row>

          <div class="my-4 subtitle-1 black--text">{{movie.year}}</div>
          <!-- <div
            v-if="movie.media_type === 'tv'"
            class="my-4 subtitle-1 black--text"
          >{{movie.first_air_date.substring(0, 4)}}</div>-->
          <div>{{ movie.description_full }}</div>
        </v-card-text>
        <v-card-actions v-if="actions">
          <v-btn :href="'/stream/' + movie.imdb_code" outlined>Watch</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ResultSearch",
  props: {
    data: Array,
    pStart: Number,
    pEnd: Number
  },
  data() {
    return {
      loading: false,
      actions: true,
      defImage: "https://www.tellerreport.com/images/no-image.png"
    };
  },
  mounted() {
    this.reserve();
  },
  methods: {
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    }
  }
};
</script>