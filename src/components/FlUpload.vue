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
    data(){
        return {
            url: 'http://localhost/~staskialt/cvtfltlg/cvtfltlg.cgi?debug=1',
            info : null,
            file: ''
        }
    },
    methods: {
        submitFile(){
            let formData = new FormData();
            formData.append('file', this.file);
            axios.post( 'http://localhost/~staskialt/cvtfltlg/cvtfltlg.cgi?debug=1',
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            }
            ).then(response => {
                this.info = response.data
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
