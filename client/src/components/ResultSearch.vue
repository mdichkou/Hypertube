<template>
  <v-row>
      <v-card v-for="(movie,index) in data.slice(pStart, pEnd)" :key="index"  :loading="loading" class="card card-right col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
        <v-img  class="card-img-top" v-if="movie.large_cover_image"  :src="movie.large_cover_image"></v-img>
        <v-img   class="card-img-top" v-else  :src="defImage"></v-img>

        <v-card-title>{{movie.title}}</v-card-title>
        <!-- <v-card-title v-if="movie.media_type === 'tv'">{{movie.name}}</v-card-title> -->
        <v-card-text class="card-body">
          <v-row align="center">
            <v-rating
              :value="movie.rating / 2"
              color="amber"
              half-increments
              dense
              class="pl-3"
              size="14"
              readonly
            ></v-rating>

            <div class="grey--text pl-2">{{movie.rating}}</div>
          </v-row>

          <!-- <div class="my-4 subtitle-1 black--text">{{movie.year}}</div>
          <div>{{ movie.description_full }}</div> -->
        </v-card-text>
        <!-- <v-card-actions v-if="actions">
          <v-btn @click="dataShare(movie)" outlined>Watch</v-btn>
        </v-card-actions> -->
      </v-card>
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

      setTimeout(() => (this.loading = false), 1000);
    },
    dataShare(movie)
    {
      //:href="'/video/' + movie.imdb_code"
      this.$router.push({path: `/video/${movie.imdb_code}`, params: {hash: 'test'}})
      // this.$store.dispatch("dataShare", movie)
    }
  }
};
</script>
<style>
.card-right{
  width: 300px;
  float: left;
}
@media only screen and (max-width: 800px) {
  .card {
    width: 100% !important;
  }
  .div-left{
    padding-left: 0
  }
}

</style>