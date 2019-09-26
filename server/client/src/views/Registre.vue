<template>
<v-container fill-height fluid grid-list-xl class="containers">
            <v-layout justify-space-around wrap>
            <v-flex xs12>
                <v-card max-width="600px" class="ma-auto" dark style="background:rgba(0, 0, 0, 0.7);">
                    <v-toolbar height="50px"  dark style="background:rgba(0, 0, 0, 0.5);">
                    <v-icon v-if="isDragging != 'success'" color="white" class="mx-1">person_add</v-icon>
                    <v-avatar v-else >
                        <v-img :src="this.image"></v-img>
                    </v-avatar>
                    <v-toolbar-title class="ml-2 white--text">{{ $t('Signup.signup') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-form v-model="valid" ref="form" lazy-validation class="mx-3 mt-3">
                        <v-card class="pa-2" id="uploads" v-if="isDragging != 'success'"
                        @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop"
                        @dragover.prevent :color="uploadColor">
                            <v-layout row wrap  justify-space-between>
                                <v-flex class="mt-1" xs-4>
                                    <v-icon  color="white" class="mx-2 mb-1">cloud_upload</v-icon>
                                    <span class="white--text subtitle-1"> {{ $t('Signup.drag') }}</span>
                                </v-flex>
                                <v-flex class="mt-1" xs-4>
                                    
                                    <span class="white--text title ml-3">{{ $t('Signup.or') }}</span>
                                </v-flex>

                                <v-flex xs-4>
                                    <v-btn color="white" @click="imageLoad">
                                        <span class="black--text subtitle-1">{{ $t('Signup.select') }}</span>
                                        <v-icon color="black">arrow_drop_down</v-icon>
                                    </v-btn>
                                    <input type="file" name="myImage" id="profile-upload" style="display:none" @change="onFileChange">
                                </v-flex>
                                
                            </v-layout>
                        </v-card>
                        <v-card v-else class="pa-2" color="success">
                            <v-layout row wrap justify-space-between>

                                <v-flex class="mt-1" xs-4>
                                    <v-icon  color="white" class="mx-2 mb-1">done_all</v-icon>
                                    <span class="white--text subtitle-1">{{ file }}</span>
                                </v-flex>
                                
                                <v-flex class="mt-1" xs-4>
                                    
                                    <span class="white--text subtitle-1 ml-3">{{getImageSize(imgData.size)}}</span>
                                </v-flex>

                                <v-flex xs-4 class="ml-5">
                                    <v-btn color="white" @click="deleteImg">
                                        <span class="black--text subtitle-1">{{ $t('Signup.del') }}</span>
                                        <v-icon color="black" class="ml-1">delete</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-text-field class="mt-2" outlined  v-model="credentials.first_name" :counter="20" :rules="firstNameRules" label="First name" required/>
                        
                        <v-text-field outlined v-model="credentials.last_name" :counter="20" :rules="lastNameRules" label="Last name" required class="purple-input"/>
                       
                        <v-text-field outlined class="purple-input" v-model="credentials.username" :counter="20" :rules="nameRules" label="Username" required />
                        
                        <v-text-field outlined v-model="credentials.email" :rules="emailRules" label="Email Address" required/>
                        
                        <v-text-field  outlined v-model="credentials.password" :rules="passwordRules" label="Password" :type="show1 ? 'text' : 'password'"
                         @click:append="show1 = !show1" :append-icon="show1 ? 'visibility' : 'visibility_off'" :counter="20" required/>
                        
                        <v-btn block :disabled="!valid || !isEmpty" @click="registerUser" class="my-2 font-weight-light"  color="blue lighten-2">
                        {{ $t('Signup.signup') }}
                        </v-btn>
                </v-form>
                <v-snackbar v-model="snackbar" :timeout="5000" color="error" right top class="mt-4">
                    <v-icon color="white">error</v-icon>
                    <span>{{ text }}</span>
                <v-btn color="white" text  @click="snackbar = false">
                    Close
                </v-btn>
                </v-snackbar>
        </v-card>
            </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import Axios from 'axios'

export default {
    data() {
        return {
            isDragging: 'blue lighten-2',
            imgData: '',
            image: '',
            file: '',
            valid: true,
            show1: false,
            snackbar: false,
            text: '',
            credentials: {
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
            },
            firstNameRules: [
                v => !!v || 'First name is required',
                v => /^[a-zA-Z]{3,20}$/i.test(v) || 'First name must have between 3 and 20 and only Alphabetic'
            ],
            
            lastNameRules: [
                v => !!v || 'Last Name is required',
                v => /^[a-zA-Z]{3,20}$/i.test(v) || 'Last name must have between 3 and 20 and only Alphabetic'
            ],
            
            nameRules: [
                v => !!v || 'Username is required',
                v => /^[a-zA-Z0-9]{3,20}$/i.test(v) || 'Username must have between 3 and 20 and only Alphanum'
            ],
            
            passwordRules: [
                v => !!v || 'Password is required',
                v => /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,20}$/.test(v) || 'Password requires 1 lower 1 upper case letter and 1 digit and between 5 and 20'
            ],
            
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
            ],
            status: 0,
        }
    },
    
    methods: {
        deleteImg() {
            this.isDragging = "blue lighten-2";
            this.image = '';
            this.file = '';
            this.imgData = '';
        },
        onDragEnter(e) {
            e.preventDefault();
            this.isDragging = 'green';
        },
        onDragLeave(e) {
            e.preventDefault();
            this.isDragging = 'blue lighten-2';
        },
        onDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const files = e.dataTransfer.files[0];
            this.addImg(files);
        },
        onFileChange(e) {
            const files = e.target.files[0];
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
                this.imgData = file; 
                this.file = file.name;
                this.isDragging = 'success';
                const reader = new FileReader();
                reader.onload = (i) => this.image = i.target.result;
                reader.readAsDataURL(file);
            }
        },
        imageLoad() {
            document.getElementById('profile-upload').click();
        },
        onFileLoad(e) {
            console.log(e);
        },
        registerUser() {
            if (this.imgData == '')
            {
                this.snackbar = true;
                this.text = 'Please select an image'
                return ;
            }
            const formData = new FormData();
            const options = {
                headers: {'Credentials-Header': JSON.stringify(this.credentials)}
            };
            formData.append('myImage', this.imgData);
            //formData.append('credentials', JSON.stringify(this.credentials));
            Axios.post('http://localhost:3001/signup', formData, options)
            .then(res => {
                console.log(res)
                if (res.data.status === "success")
                {
                    this.$router.push({name: 'login', params: {status: 'success', text: res.data.msg}})
                }
                else
                {
                    this.snackbar = true;
                    this.text = res.data.msg
                } 
            })
            .catch(err => {
                console.log(err)
                // if (err.response.status == 422)
                // {
                //     this.snackbar = true;
                //     this.text = err.response.data
                // }
            })
        },
        getImageSize(size)
        {
            const stype = ['Bytes', 'KB', 'MB', 'GB'];
            let i = 0;

            while (size > 900)
            {
                size /= 1024;
                i++;
            }
            return `${(Math.round(size * 100) / 100)} ${stype[i]}`
        },
        removeDiv() {
            this.status = 0
        }
    },
    computed: {
        isEmpty() {
            return this.credentials.first_name && this.credentials.last_name && this.credentials.username 
            && this.credentials.email && this.credentials.password
        },
        uploadColor()
        {
            return this.isDragging;
        }
    }
}
</script>
