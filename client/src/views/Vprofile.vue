<template>
    <v-container>
        <v-layout v-if="loader == true">
            <v-progress-circular class="mx-auto my-3" :size="60" :width="7"
                color="blue lighten-2"
                v-show="loader"
                indeterminate>
            </v-progress-circular>
        </v-layout >
        <v-layout justify-space-around wrap v-else>
            <v-card width="650px" class="mx-auto mb-auto mt-2"  dark elevation="15">
                <v-flex xs12 >
                    <v-avatar class="ma-auto d-block" size="120">
                        <v-img :src="userData.avatar"></v-img>
                    </v-avatar>
                </v-flex>
                <v-card-text class="text-xs-center">
                <h6 class="category subheading mb-3">
                <span class="mr-1">{{userData.username}}</span>
                </h6>
                <h4 class="card-title font-weight-light">{{userData.first_name}} {{userData.last_name}}</h4>
          </v-card-text>
        </v-card>
    </v-layout>
    </v-container>
</template>

<script>
import Axios from 'axios'

export default {
    mounted() {
        this.loader = true
        setTimeout(()=>{
        this.loader = false
        }, 700);
        const token = window.localStorage.getItem('token')
        if (token) Axios.defaults.headers.common['x-auth-token'] = token
        else delete Axios.defaults.headers.common['x-auth-token']
    
        console.log("this is the visitor id == " + this.$route.params.id);
        // Axios.get('http://localhost:3001/profile')
        // .then(res => {
        //     if (res.data === "failure")
        //         this.$router.push({name: 'login'});
        //     else
        //         this.userData = res.data
        //     console.log(res)
        // })
        // .catch(err => {
        //     if (err.response.status == 401)
        //         this.$router.push({name: 'login'});
        //     console.log(err)
        // })
    },
    data() {
        return {
            loader: false,
            userData: {
                username: '',
                first_name: '',
                last_name: '',
                avatar: '',
            }
        }
    }
}
</script>