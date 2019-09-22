<template>
  <v-row>
    <v-col v-for="(movie,index) in data.slice(pStart, pEnd)" :key="index" lg="6" md="6">
      <v-card
        :loading="loading"
        class="mx-auto my-12"
        max-width="374"
        v-if="movie.media_type === 'movie' || movie.media_type === 'tv'"
      >
        <v-img v-if="movie.poster_path" height="250" :src="imgUrl + movie.poster_path"></v-img>
        <v-img v-else-if="movie.backdrop_path" height="250" :src="imgUrl + movie.backdrop_path"></v-img>
        <v-img v-else height="250" :src="defImage"></v-img>

        <v-card-title v-if="movie.media_type === 'movie'">{{movie.title}}</v-card-title>
        <v-card-title v-if="movie.media_type === 'tv'">{{movie.name}}</v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-rating
              :value="movie.vote_average"
              color="amber"
              half-increments
              dense
              class="pl-3"
              size="14"
              readonly
            ></v-rating>

            <div class="grey--text pl-2">{{movie.vote_average + "(" + movie.vote_count + ")"}}</div>
          </v-row>

          <div
            v-if="movie.media_type === 'movie'"
            class="my-4 subtitle-1 black--text"
          >{{movie.release_date.substring(0, 4)}}</div>
          <div
            v-if="movie.media_type === 'tv'"
            class="my-4 subtitle-1 black--text"
          >{{movie.first_air_date.substring(0, 4)}}</div>
          <div>{{ movie.overview }}</div>
        </v-card-text>
        <v-card-actions v-if="actions">
          <v-btn
            :href="'/stream/' + movie.release_date.substring(0, 4) + '/'+movie.title"
            outlined
          >Watch</v-btn>
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
    imgUrl: String,
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