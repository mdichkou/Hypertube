<template>
  <div>Stream {{ year + " " + name }}</div>
</template>

<script>
import axios from "axios";
export default {
  name: "Streaming",
  mounted() {
    this.name = this.$route.params.name;
    this.year = this.$route.params.year;
    axios.post("http://localhost:4000/api/torrent", {
      name: this.name,
      year: this.year
    });
  },
  data: () => ({
    name : "",
    year: ""
  })
};
</script>