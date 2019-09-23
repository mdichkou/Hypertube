<template>
  <div>
    <v-container>
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
      <v-row no-gutters v-if="dataMovie && inputData">
        <v-col cols="4">
          <v-card class="mx-auto" max-width="300" tile style="margin-top:60px">
            <v-list rounded>
              <v-subheader>Genre</v-subheader>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i" @click="takeValue(i)">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text + ' (' + item.count + ')'"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <!-- <hr />

              <v-subheader>Filtre</v-subheader>
              <v-card-text>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p>Imdb rating:</p>
                    <v-slider
                      v-model="slider"
                      @input="load_data"
                      class="align-center"
                      :max="10"
                      :min="0"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          disabled
                          class="mt-0 pt-0 align-center"
                          v-model="slider"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p>Production year:</p>
                    <v-slider
                      v-model="slider2"
                      @input="load_data"
                      class="align-center"
                      :max="get_year"
                      :min="1900"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          disabled
                          class="mt-0 pt-0 align-center"
                          v-model="slider2"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p>Genre :</p>
                    <v-col class="d-flex" cols="12">
                      <v-select
                        v-model="selected_val"
                        @change="load_data"
                        :items="genre_list"
                        item-text="name"
                        item-value="id"
                        label="Standard"
                      ></v-select>
                    </v-col>
                  </v-col>
                </v-row>
              </v-card-text>-->
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="8">
          <ResultSearch :data="dataMovie" :page="1" :pStart="p_start" :pEnd="p_end" />
          <!-- <ResultSearch
            v-if="value === 1"
            :data="dataTv"
            :imgUrl="imageUrl"
            :page="1"
            :pStart="p_start"
            :pEnd="p_end"
          />-->
          <div class="text-center">
            <v-pagination
              v-if="value === 1"
              v-model="page_tmp"
              :length="nbr_p_tv"
              @input="affich_page"
            ></v-pagination>
            <v-pagination
              v-if="value === 0"
              v-model="page_tmp"
              :length="nbr_p_movies"
              @input="affich_page"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import ResultSearch from "./ResultSearch";

const sortJsonArray = require("sort-json-array");

export default {
  name: "SearchVue",
  components: {
    ResultSearch
  },
  data() {
    return {
      item: 0,
      selection: 1,
      value: 0,
      items: [{ text: "Movies", count: 0 }, { text: "Tv Show", count: 0 }],
      inputData: "",
      dataMovie: null,
      dataTv: null,
      baseUrl: "",
      imageSize: "",
      imageUrl: "",
      nbr_p_movies: 0,
      nbr_p_tv: 0,
      page_tmp: 1,
      p_start: 0,
      p_end: 5,
      get_year: new Date().getFullYear() + 1,
      slider: 0,
      slider2: 0,
      genre_list: [],
      selected_val: null
    };
  },
  mounted() {},
  methods: {
    affich_page() {
      this.p_start = (this.page_tmp - 1) * 5;
      this.p_end = this.p_start + 5;
      window.scrollTo(0, 0);
    },
    takeValue: function(value) {
      this.p_start = 0;
      this.p_end = 5;
      this.page_tmp = 1;
      this.value = value;
      // if (value == 0) this.load_genre("movie");
      // else this.load_genre("tv");
    },
    signalChange: function() {
      if (this.inputData.trim() != "") {
        axios
          .get("http://localhost:4000/api/search?input=" + this.inputData)
          .then(res => {
            this.dataMovie = sortJsonArray(res.data.movies, "title");
            this.items[0].count = res.data.movies.length;
            this.nbr_p_movies = Math.ceil(res.data.movies.length / 5);
          });
        // var url =
        //   "https://api.themoviedb.org/3/search/multi?api_key=a07a2fef9fafa52ff4d4b6533fbeade8&adult=false&query=";
        // url += this.inputData;
        // this.inputData &&
        //   axios.get(url).then(response => {
        //     const resultMovie = response.data.results.filter(word => {
        //       if (word.media_type == "movie") return true;
        //       else return false;
        //     });
        //     const resultTv = response.data.results.filter(word => {
        //       if (word.media_type == "tv") return true;
        //       else return false;
        //     });
        //     this.dataTv = sortJsonArray(resultTv, "name");
        //     this.dataMovie = sortJsonArray(resultMovie, "title");
        //     this.items[0].count = resultMovie.length;
        //     this.items[1].count = resultTv.length;
        //     this.nbr_p_movies = Math.ceil(resultMovie.length / 5);
        //     this.nbr_p_tv = Math.ceil(resultTv.length / 5);
        //   });
      }
    }
    // load_genre: function(type_genre) {
    //   var url =
    //     "https://api.themoviedb.org/3/genre/" +
    //     type_genre +
    //     "/list?api_key=a07a2fef9fafa52ff4d4b6533fbeade8&language=en-US";
    //   axios.get(url).then(response => {
    //     this.genre_list = response.data.genres;
    //   });
    // },
    // load_data: function() {
    //   var url =
    //     "https://api.themoviedb.org/3/search/multi?api_key=a07a2fef9fafa52ff4d4b6533fbeade8&adult=false&query=";
    //   url += this.inputData;
    //   if (this.value == 0) {
    //     // search with movies
    //     this.inputData.trim() &&
    //       axios.get(url).then(response => {
    //         const resultMovie = response.data.results.filter(word => {
    //           if (
    //             word.vote_average >= this.slider &&
    //             word.media_type == "movie" &&
    //             word.release_date.substring(0, 4) >= this.slider2
    //           ) {
    //             if (this.selected_val != null) {
    //               if (word.genre_ids.includes(this.selected_val)) return true;
    //               else return false;
    //             } else return true;
    //           } else return false;
    //         });

    //         this.dataMovie = resultMovie;
    //         this.items[0].count = resultMovie.length;
    //         this.nbr_p_movies = Math.ceil(resultMovie.length / 5);
    //       });
    //   } // search with tv
    //   else {
    //     this.inputData.trim() &&
    //       axios.get(url).then(response => {
    //         const resultTv = response.data.results.filter(word => {
    //           if (
    //             word.vote_average >= this.slider &&
    //             word.media_type == "tv" &&
    //             word.first_air_date.substring(0, 4) >= this.slider2
    //           ) {
    //             if (this.selected_val != null) {
    //               if (word.genre_ids.includes(this.selected_val)) return true;
    //               else return false;
    //             } else return true;
    //           } else return false;
    //         });

    //         this.dataTv = resultTv;
    //         this.items[1].count = resultTv.length;
    //         this.nbr_p_tv = Math.ceil(resultTv.length / 5);
    //       });
    //   }
    // }
  }
};
</script>