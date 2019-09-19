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
      <v-row no-gutters v-if="dataTv && dataMovie && inputData">
        <v-col cols="4">
          <v-card class="mx-auto" max-width="300" tile>
            <v-list rounded>
              <v-subheader>Genre</v-subheader>
              <v-list-item-group v-model="item" color="primary">
                <v-list-item v-for="(item, i) in items" :key="i" @click="takeValue(i)">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text + ' (' + item.count + ')'"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="8">
          <ResultSearch v-if="value === 0" :data="dataMovie" :imgUrl="imageUrl" />
          <ResultSearch v-if="value === 1" :data="dataTv" :imgUrl="imageUrl" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import ResultSearch from "./ResultSearch";

Vue.use(VueAxios, axios);

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
    takeValue: function(value) {
      this.value = value;
    },
    signalChange: function() {
      var url =
        "https://api.themoviedb.org/3/search/multi?api_key=a07a2fef9fafa52ff4d4b6533fbeade8&adult=false&query=";
      url += this.inputData;
      this.inputData &&
        Vue.axios.get(url).then(response => {
          const resultMovie = response.data.results.filter(word => {
            if (word.media_type == "movie") return true;
            else return false;
          });
          const resultTv = response.data.results.filter(word => {
            if (word.media_type == "tv") return true;
            else return false;
          });
          this.dataTv = sortJsonArray(resultTv, "name");
          this.dataMovie = sortJsonArray(resultMovie, "title");
          this.items[0].count = resultMovie.length;
          this.items[1].count = resultTv.length;
        });
    }
  }
};
</script>