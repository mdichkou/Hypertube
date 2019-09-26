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
            <v-card max-width="650px" class="mx-auto mb-auto mt-2"  dark style="background:rgba(0, 0, 0, 0.7);" elevation="15">
                <v-form class="ma-auto" ref="form" v-model="valid" lazy-validation>
                    <v-layout justify-space-around wrap class="ma-1">
                        <v-flex xs12 >
                            <v-avatar  v-if="this.Imgswitch == false" @click="imageLoad"  class="ma-auto d-block avatar" size="120px">
                                <v-img :src="ImgSource(this.userData.avatar)"></v-img>
                            </v-avatar>

                            <v-avatar v-else @click="imageLoad" class="ma-auto d-block avatar" size="120px">
                                <v-img :src="this.image2"></v-img>
                            </v-avatar>
                            <input type="file" name="myImage" id="profile-upload" style="display:none" @change="onFileChange">
                        </v-flex>

                        <v-flex xs12 md5>
                            <v-text-field class="ma-0 pa-0" :rules="nameRules" v-model="userData.username" :counter="20" label="Username" required />
                        </v-flex>
                        <v-flex xs12 md5>
                            <v-text-field class="ma-0 pa-0" v-model="userData.email" :rules="emailRules" label="Email Address" required/>
                        </v-flex>
                        
                        <v-flex xs12 md5>
                            <v-text-field class="ma-0 pa-0" v-model="userData.first_name" :counter="20" :rules="firstNameRules" label="First name" required/>
                        </v-flex>
                        <v-flex xs12 md5>
                            <v-text-field class="ma-0 pa-0" v-model="userData.last_name" :counter="20" :rules="lastNameRules" label="Last name" required/>
                        </v-flex>
                        <v-flex xs12 md10 v-if="outsource === false">
                            <v-text-field class="ma-0 pa-0" label="Password" v-model="userData.password" :type="show ? 'text' : 'password'"
                              @click:append="show = !show" :append-icon="show ? 'visibility' : 'visibility_off'" :counter="20" required/>
                        </v-flex>
                        <v-flex xs12 text-xs-right>
                        <v-btn block :disabled="!valid" @click="updateUser" class="ma-0 font-weight-light white--text" color="blue lighten-2">
                            {{ $t('Settings.update') }}
                        </v-btn>
                        </v-flex>
                    </v-layout>

                </v-form>
            </v-card>
    </v-layout>
        <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
                <v-icon color="white">error</v-icon>
                <span>{{ text }}</span>
            <v-btn color="white" text  @click="snackbar = false">
                Close
            </v-btn>
            </v-snackbar>
            <v-snackbar v-model="snackbar2" :timeout="5000" color="success" right top class="mt-4">
                <v-icon color="white">done</v-icon>
                <span>{{ text }}</span>
            <v-btn color="white" text  @click="snackbar2 = false">
                Close
            </v-btn>
        </v-snackbar>

        <v-dialog max-width="400px" scrollable v-model="dialog">
          <v-btn block v-slot:activator="{ on }" style="display: none" color="pink" dark></v-btn>
            <v-card color="grey lighten-5" height="400px">
               
                    <v-img height="90px" :src="this.image"></v-img>
               
                <v-btn color="blue lighten-2" class="white--text" @click="setPicture">
                    {{ $t('Settings.cheeze')}}
                </v-btn>
            </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import Axios from 'axios'
import i18n from '../i18n'

export default {
    mounted() {
        this.loader = true
        setTimeout(()=>{
            this.loader = false
            this.userData = this.$store.state.userData;
            if (this.userData.password === '1')
                this.outsource = true;
        }, 700);
        console.log(this.userData)
    },
    data() {
        return {
            loader: false,
            dialog: false,
            show: false,
            snackbar: false,
            snackbar2: false,
            valid: true,
            text: '',
            outsource: false,
            userData: {
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                avatar: '',
            },
            Imgswitch: false,
            imgData: '',
            file: '',
            image: '',
            image2: '',
            firstNameRules: [
                v => !!v || 'First name is required',
                v => /^[a-zA-Z]{3,20}$/.test(v) || 'A-z and must be between 3 and 20 characters'
            ],
            lastNameRules: [
                v => !!v || 'Last name is required',
                v => /^[a-zA-Z]{3,20}$/.test(v) || 'A-z and must be between 3 and 20 characters'
            ],
            nameRules: [
                v => !!v || 'Username is required',
                v => /^[a-zA-Z0-9]{3,20}$/.test(v) || 'A-9 and must be between 3 and 20 characters'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
            ],
        }
    },
    methods: {
        setPicture()
        {
            this.dialog = false;
            const formData = new FormData();
            this.image2 = this.image;
            this.Imgswitch = true;

            formData.append('myImage', this.imgData)
            Axios.post('http://localhost:3001/settings/updateImg', formData)
            .then(res => {
                if (res.data.status == "success")
                {
                    this.snackbar2 = true;
                    this.text = res.data.msg
                }
                else
                {
                    this.snackbar = true;
                    this.text = this.file + ' is invalid'
                }
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
        },
        onFileChange(e) {
            const files = e.target.files[0];
            if (files != undefined)
                this.addImg(files);
        },
        addImg(file) {
            if (!file.type.match('image/jpeg|image/jpg|image/png'))
            {
                this.snackbar = true;
                this.isDragging = 'error';
                this.text = `${file.name} is not an image`
                return;
            }
            else
            {
                this.dialog = true;
                this.imgData = file; 
                this.file = file.name;
                const reader = new FileReader();
                reader.onload = (i) => this.image = i.target.result;
                reader.readAsDataURL(file);
           }
        },
        imageLoad() {
            document.getElementById('profile-upload').click();
        },
        updateUser() {
            Axios.post('http://localhost:3001/settings/updateData', this.userData)
            .then(res => {
                console.log(res)
                if (res.data.status === "success")
                {
                    this.snackbar2 = true;
                    this.text = res.data.msg
                }
                else
                {
                    this.snackbar = true;
                    this.text = res.data.msg
                } 
            })
            .catch(err => {
                console.log(err)
                if (err.response.status == 422)
                {
                    this.snackbar = true;
                    this.text = err.response.data
                }
            })
        },
        ImgSource(image)
        {
            if (image.includes("images/") == true)
                return require("../../../server/" + image)
            else
                 return image
        }
    },
    computed: {
    }

}
</script>

<style>
 .avatar:hover {
     cursor: pointer;
     opacity: 0.9;
 }
</style>
