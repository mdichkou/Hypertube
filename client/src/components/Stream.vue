<template>
  <div class="embed-responsive embed-responsive-21by9">
    <!-- Stream {{ this.$route.params.year + " " + this.$route.params.name }} -->
      <video  width="320" height="240"  autoplay  controls intrinsicsize >
          <source :src="'http://localhost:1337/video/'+this.id" type="video/mp4">
      </video>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Streaming",
  mounted() {
    this.id = this.$route.params.id;
    // axios.post("http://localhost:1337/api/torrent", {
    //   id: this.id
    // });
  },
  data: () => ({
    id: ""
  })
};
</script>