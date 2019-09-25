<template>
  <div class="embed-responsive embed-responsive-21by9">
    <!-- Stream {{ this.$route.params.year + " " + this.$route.params.name }} -->
    <video width="320" height="240" autoplay controls intrinsicsize controlsList="nodownload">
      <source :src="'http://localhost:1337/video/'+this.hash" type="video/mp4" />
      <track
        v-for="(subtitle,index) in SubTitles"
        :key="index"
        :src="'/subtitles/' + id + '/' + subtitle.lang + '.vtt'"
        kind="subtitles"
        :srclang="subtitle.langcode"
        :label="subtitle.lang"
      />
    </video>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Streaming",
  mounted() {
    this.id = this.$route.params.id;
    this.hash = this.$route.params.hash;
    axios.post("http://localhost:1337/getSubt", {
        imdb_id: this.id
      })
      .then(resp => {
        this.SubTitles = resp.data;
      });
  },
  data: () => ({
    id: "",
    hash: "",
    SubTitles: null
  })
};
</script>