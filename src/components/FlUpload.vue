<template>
<div class="upload-container">
<slot></slot>
<button class="upload-button">upload</button>
<input type="file" id="file" ref="file" @change="handleFileUpload()">
</div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'HelloWorld',
    props: {
        debug : Number,
        url : String
    },
    
    data(){
        return {
            //mybase_url : process.env.NODE_ENV === 'development' ? //'localhost/~staskialt/cvtfltlg/cvtfltlg.cgi' :   //'venus-flytrap.de/fly/flight-log/cvtfltlg.cgi',
            //url : 'http://' + this.mybase_url,
            //surl : 'https://' + this.base_url,
            info : null,
            file: ''
        }
    },
    methods: {
        submitFile(){
            let formData = new FormData();
            let url = this.url + '/cvtfltlg.cgi'
            if (this.debug == 1){
                url = url + '?debug=1'
            }

            formData.append('file', this.file);
            axios.post( url,
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            }
            ).then(response => {
                this.info = response.data
                // eslint-disable-next-line
                console.log(this.info)
                this.$emit('send-result', this.info)
            })
            .catch(function(){
                // eslint-disable-next-line
                console.log('FAILURE!!');
            });
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
            this.submitFile()
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.upload-container {
    position: relative;
    overflow: hidden;
    width: 120px;
    display: inline-block;
    margin: auto;
}

.upload-button {
    width: 120px;
    border: 2px solid gray;
    color: gray;
    background-color: white;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
}

input[type='file'] {
    overflow: hidden;
    font-size: 200px;
    height: inherit;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}

</style>
