<template>
  <div>Stream {{ this.$route.params.year + " " + this.$route.params.name }}</div>
</template>

<script>
import axios from "axios";
export default {
  name: "Streaming",
  mounted() {
    axios.post("http://localhost:4000/api/download", {
      name: this.$route.params.name
    });
  },
  data: () => ({
    //
  })
};
</script>