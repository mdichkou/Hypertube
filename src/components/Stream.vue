<template>
  <div>Stream {{"imdb id " + id }}</div>
</template>

<script>
import axios from "axios";
export default {
  name: "Streaming",
  mounted() {
    this.id = this.$route.params.id;
    axios.post("http://localhost:4000/api/torrent", {
      id: this.id
    });
  },
  data: () => ({
    id: ""
  })
};
</script>