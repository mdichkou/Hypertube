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
      <v-row no-gutters v-if="dataMovie">
          <div class="div-left col-lg-3 col-md-4  col-sm-12 col-12">
          <v-card class="card" >
            <v-list rounded>
              <v-subheader>Genre</v-subheader>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i" @click="takeValue(i)">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text + ' (' + item.count + ')'"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>

              <hr />

              <v-subheader>Filtre</v-subheader>
              <v-card-text>
                <v-row>
                  <v-col class="pr-4 pt-0">
                    <p style="color:black">Imdb rating:</p>
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
                    <p style="color:black">Production year:</p>
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
                    <p style="color:black">Genre :</p>
                    <v-col class="d-flex" cols="12">
                      <v-select
                        v-model="selected_val"
                        @change="load_data"
                        :items="genre_list"
                        label="Standard"
                      ></v-select>
                    </v-col>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-list>
          </v-card>
          </div>
          <div class="div-right col-lg-9 col-md-8  col-sm-12 col-12">
          <ResultSearch :data="dataMovie" :page="1" :pStart="p_start" :pEnd="p_end" />
           <div  class="text-center">
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
           </div>
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
      dataMovie_all: null,
      popularMovies: null,
      dataMovie: null,
      dataTv: null,
      baseUrl: "",
      imageSize: "",
      imageUrl: "",
      nbr_p_movies: 0,
      nbr_p_tv: 0,
      page_tmp: 1,
      p_start: 0,
      p_end: 8,
      get_year: new Date().getFullYear() + 1,
      slider: 0,
      slider2: 0,
      genre_list: [
        "Standard",
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Film Noir",
        "History",
        "Horror",
        "Music",
        "Mystery",
        "Musical",
        "Romance",
        "Sci-Fi",
        "Short Film",
        "Sport",
        "Superhero",
        "Thriller",
        "War",
        "Western"
      ],
      selected_val: null
    };
  },
  mounted() {
    this.getPopulerMovie();
  },
  methods: {
    affich_page() {
      this.p_start = (this.page_tmp - 1) * 8;
      this.p_end = this.p_start + 8;
      window.scrollTo(0, 0);
    },
    takeValue: function(value) {
      this.p_start = 0;
      this.p_end = 8;
      this.page_tmp = 1;
      this.value = value;
    },
    signalChange: function() {
      if (this.inputData.trim() != "") {
        axios.get("https://yts.unblocked4u.net/api/v2/list_movies.json?query_term=" + this.inputData)
          .then(res => {
            if (res.data.data.movie_count > 0) {
              this.dataMovie = sortJsonArray(res.data.data.movies, "title");
              this.dataMovie_all = this.dataMovie;
              this.items[0].count = this.dataMovie.length;
              this.nbr_p_movies = Math.ceil(this.dataMovie.length / 8);
            } else {
              this.dataMovie = null;
              this.items[0].count = 0;
              this.nbr_p_movies = 0;
            }
          });
      }
      else
      {
        this.dataMovie = sortJsonArray(this.popularMovies, "title");
        this.dataMovie_all = this.dataMovie;
        this.items[0].count = this.dataMovie.length;
        this.nbr_p_movies = Math.ceil(this.dataMovie.length / 8);
      }
    },
    load_data: function() {
      if (this.selected_val == "Standard") this.selected_val = null;
      if (this.value == 0) {
        var Movie_tmp = this.dataMovie_all;
        if (Movie_tmp) {
          Movie_tmp = Movie_tmp.filter(word => {
            if (word.rating >= this.slider && word.year >= this.slider2) {
              if (this.selected_val != null) {
                if (word.genres.includes(this.selected_val)) return true;
                else return false;
              } else return true;
            } else return false;
          });
          this.dataMovie = sortJsonArray(Movie_tmp, "title");
          this.items[0].count = this.dataMovie.length;
          this.nbr_p_movies = Math.ceil(this.dataMovie.length / 8);
        }
      }
    },
    getPopulerMovie() {
      axios.get("https://yts.unblocked4u.net/api/v2/list_movies.json?sort_by=download_count&order_by=desc&limit=15")
      .then(res => {
        this.popularMovies = res.data.data.movies;
        this.signalChange();
      });
    }
  }
};
</script>
<style>
.container{
  
  max-width: 1700px;
 
}
.card{
   padding: 0;
   /* margin-right: 5px; */
   margin-top: 20px;
  transform: perspective(800px);
  transform-style: preserve-3d;
  cursor: pointer;
}
.div-left{
    float:left;
    padding-left:10px;
}
.div-right{
    float:right;
    padding-left:40px !important;
}
.text-center{
  margin-top: 8px;
}
/* @media (min-width: 601px){
 .div-left {
    width: 26.33333%;
}
}
@media (min-width: 601px){
 .div-right {
    width: 66.66666%;
}
} */
/* @media only screen and (max-width: 1132px) {
  .card {
    width: 80% !important;
  }
  .div-left{
    padding-left: 0
  }
} */
@media only screen and (max-width: 768px) {
  .div-right {
    padding-left: 0 !important;
  }
}
</style>
