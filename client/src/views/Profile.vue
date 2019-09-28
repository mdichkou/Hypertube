<template>
    <v-container fill-height fluid grid-list-xl>
        <v-layout v-if="loader == true">
            <v-progress-circular class="mx-auto my-3" :size="60" :width="7"
                color="blue lighten-2"
                v-show="loader"
                indeterminate>
            </v-progress-circular>
        </v-layout >
        <v-layout justify-space-around wrap v-else>
            <v-card width="650px" class="mx-auto mb-auto mt-2"  dark style="background:rgba(0, 0, 0, 0.7);" elevation="15">
                <v-flex xs12 >
                    <v-avatar class="ma-auto d-block" size="120">
                        <v-img :src="ImgSource(userData.avatar)"></v-img>
                    </v-avatar>
                </v-flex>
                <v-card-text class="text-xs-center">
                <span>{{ $t('message') }}</span><br>
                <span class="mr-1">{{userData.username}}</span>
                <h4 class="card-title font-weight-light">{{userData.first_name}} {{userData.last_name}}</h4>
          </v-card-text>
        </v-card>
    </v-layout>
    <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
                <v-icon color="white">error</v-icon>
                <span>{{ text }}</span>
            <v-btn color="white" text  @click="snackbar = false">
                Close
            </v-btn>
    </v-snackbar>
    </v-container>
</template>

<script>
import Axios from 'axios'

export default {
    mounted() {
        this.loader = true
        setTimeout(()=> {
            if (this.$route.params.id == undefined || !isNumeric(this.$route.params.id))
            {
                this.userData.username = this.$store.state.userData.username;
                this.userData.first_name = this.$store.state.userData.first_name;
                this.userData.last_name = this.$store.state.userData.last_name;
                this.userData.avatar = this.$store.state.userData.avatar;
            }
            this.loader = false
        }, 700);
        const token = window.localStorage.getItem('token')
        if (token) Axios.defaults.headers.common['x-auth-token'] = token
        else delete Axios.defaults.headers.common['x-auth-token']
    
        function isNumeric(value) {
            return /^\d+$/.test(value);
        }
        if (this.$route.params.id != undefined && isNumeric(this.$route.params.id))
        {
            console.log("salam")
            Axios.post('http://localhost:3001/profile/visit', {id: this.$route.params.id})
            .then(res => {
                if (res.data.status === "failure")
                {
                    this.snackbar = true
                    this.text = res.data.msg
                }
                else
                {
                    this.userData = res.data.msg
                    console.log("data changed")
                }
                console.log(res)
            })
            .catch(err => {
                if (err.response.status == 401)
                    this.$router.push({name: 'login'});
                console.log(err)
            })
        }
    },
    data() {
        return {
            loader: false,
            snackbar: '',
            text: '',
            userData: {
                username: '',
                first_name: '',
                last_name: '',
                avatar: '',
            }
        }
    },
    methods: {
        ImgSource(image)
        {
            if (image.includes("images/") == true)
                return require("../../public" + image)
            else
                 return image
        }
    },
    computed: {
    }
}
</script>
