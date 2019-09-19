<template>
<v-col cols="8">
  <v-row @change="reset_funtion">
     <v-col v-for="(movie,index) in data.slice(p_start, p_end)" :key="index" lg="6" md="6">
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
              size="14"
              readonly
            ></v-rating>

            <div class="grey--text">{{movie.vote_average + "(" + movie.vote_count + ")"}}</div>
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
      </v-card>
    </v-col>
  </v-row>
   <div class="text-center">
            <v-pagination v-model="page" :length="nbr_pages" @input="affich_page"></v-pagination>
      </div>
  </v-col>
</template>

<script>
export default {
  name: "ResultSearch",
  props: {
    data: Array,
    imgUrl: String,
    nbr_pages: Number,
  },
  data() {
    return {
      loading: false,
      defImage: "https://www.tellerreport.com/images/no-image.png",
      page: 1,
      p_start: 0,
      p_end: 5,
    };
  },
  mounted() {
    this.reserve();
    this.page = 1;
  },
  methods: {
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    },
    affich_page() {
      this.p_start = (this.page - 1) * 5;
      this.p_end = this.p_start + 5;
      window.scrollTo(0, 0);
    },
    reset_funtion(){
      this.page = 1;
    },
  }
};
</script>