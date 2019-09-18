<template>
  <div class="container-fluid">
    <div class="row mx-auto">
      <section class="col-sm-12 pt-3 px-0">
        <b-form inline class="d-flex justify-content-center">
          <div class="col-md-6 col-8 pl-0">
            <b-input
              class="w-100 mr-sm-2"
              type="text"
              placeholder="Enter Search Term"
              v-model="inputData"
              @input="signalChange"
            />
          </div>
          <b-button class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-form>
      </section>
      <v-container>
        <v-row no-gutters v-if="data && inputData">
          <v-col v-for="(movie,index) in data" :key="index" class="mr-3">
            <v-card
              :loading="loading"
              class="mx-auto my-12"
              max-width="374"
              v-if="movie.media_type === 'movie' || movie.media_type === 'tv'"
            >
              <v-img v-if="movie.poster_path" height="250" :src="imageUrl + movie.poster_path"></v-img>

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
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

const sortJsonArray = require('sort-json-array');

export default {
  name: "SearchVue",
  data() {
    return {
      loading: false,
      selection: 1,
      inputData: "",
      data: null,
      baseUrl: "",
      imageSize: "",
      imageUrl: ""
    };
  },
  mounted() {
    Vue.axios
      .get(
        "https://api.themoviedb.org/3/configuration?api_key=a07a2fef9fafa52ff4d4b6533fbeade8"
      )
      .then(response => {
        this.baseUrl = response.data.images.base_url;
        this.imageSize = response.data.images.backdrop_sizes[0];
        this.imageUrl = this.baseUrl + this.imageSize;
      });
  },
  methods: {
    signalChange: function() {
      var url =
        "https://api.themoviedb.org/3/search/multi?api_key=a07a2fef9fafa52ff4d4b6533fbeade8&adult=false&query=";
      url += this.inputData;
      this.inputData &&
        Vue.axios.get(url).then(response => {
          const result = response.data.results.filter(word => {
            if (word.media_type == "movie" || word.media_type == "tv")
              return true;
            else return false;
          });
          this.data = sortJsonArray(result, 'title');
        });
    },
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    },
  }
};
</script>