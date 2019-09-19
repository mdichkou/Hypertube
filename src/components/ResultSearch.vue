<template>
  <div>
    <v-col v-for="(movie,index) in data" :key="index" class="mr-3">
      <v-card
        :loading="loading"
        class="mx-auto my-12"
        max-width="374"
        v-if="movie.media_type === 'movie' || movie.media_type === 'tv'"
      >
        <v-img v-if="movie.poster_path" height="250" :src="imgUrl + movie.poster_path"></v-img>

        <v-card-title v-if="movie.media_type === 'movie'">{{movie.title}}</v-card-title>
        <v-card-title v-if="movie.media_type === 'tv'">{{movie.name}}</v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-rating
              :value="movie.vote_average"
              color="amber"
              half-increments
              dense
              size="14"
              readonly
            ></v-rating>

            <div class="grey--text">{{movie.vote_average + "(" + movie.vote_count + ")"}}</div>
          </v-row>

          <div
            v-if="movie.media_type === 'movie'"
            class="my-4 subtitle-1 black--text"
          >{{movie.release_date}}</div>
          <div
            v-if="movie.media_type === 'tv'"
            class="my-4 subtitle-1 black--text"
          >{{movie.first_air_date}}</div>
          <div>{{ movie.overview }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </div>
</template>

<script>
export default {
  name: "ResultSearch",
  props: {
    data: Array,
    imgUrl: String
  },
  data() {
    return {
      loading: false
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