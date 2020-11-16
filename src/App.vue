<template>
<div class="app">
<div>
<b-navbar toggleable="lg" variant="dark" type="dark">
 <b-navbar-brand href="#">DEEBU Flight Log</b-navbar-brand>
 <b-btn @click="handleLogRead()">Read</b-btn>
 <b-navbar-nav class="ml-auto">
       <b-nav-form>
       <b-form-file
         plain
         v-model="file"
         ref="file"
         placeholder="chose gpx file..."
         drop-placeholder="Drop file here..."
         @change="handleFileUpload()">
        </b-form-file>
       </b-nav-form>
 </b-navbar-nav>
</b-navbar>
</div>

<flight-log-table :flight-segments="this.allflights"></flight-log-table>

</div>
</template>



<script>
const axios = require('axios');
import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import FlightLogTable from './components/FlightLogTable.vue';
Vue.component('flight-log-table', FlightLogTable);

export default {
    created: function () {
        // HTTP
        this.createurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=create',
        this.updateurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=update',
        this.deleteurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=delete',
        this.readurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=read',
        
        //HTTPS
        this.screateurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=create',
        this.supdateurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=update',
        this.sdeleteurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=delete',
        this.sreadurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=read',
        
        this.base_url = 'https://' + this.base_url
    },
    
    mounted: function () {
        this.readFlightLog()
        if (localStorage.favpilot) {
          this.favpilot = localStorage.favpilot;
        }
    },
    
    data () {
        return {
            info : null,
            file: null,
            favpilot : '',
            pilots : [
                { name: "CP", id: 0, value: 'CP', mysel: false },
                { name: "Markus", id: 1, value: 'Markus', mysel: true },
                { name: "Axel", id: 2, value: 'Axel', mysel: false },
                { name: "TestPilot", id: 3, value: 'TestPilot', mysel: false }
                ],
            allflights : [],
            debug : process.env.VUE_APP_DEBUG_MODE == 1 ? 1 : 0,
            base_url : process.env.VUE_APP_BASE_URL,
            updateurl : '',
            deleteurl : '',
            readurl : '',
            supdateurl : '',
            sdeleteurl : '',
            sreadurl : ''
        }
    },
    
    methods : {

        handleLogRead() {
            this.readFlightLog()
        },
        
        getAllFlights(){
            return this.allflights
        },

        fetchNewFlights(myInfo) {
            var p = this.pilots
            var a = this.allflights
            myInfo.forEach(function(item){
                item.duplicate = item.new = false
                item.pilot = item.pilot ? item.pilot : p[0].value
                a.forEach(function ( flight, idx){
                    flight.duplicate = false
                    if (flight.id == item.id){
                        //console.log ("found dup " + item.id + " from " + item.departureAirport)
                        flight.duplicate = true
                        item.duplicate = true
                        item.idx = idx
                    }
                });
                if (item.duplicate == false) {
                    //console.log ("found new " + item.id + " from " + item.departureAirport)
                    item.new = true
                }
            });

            myInfo.forEach(function(item){
                //console.log("new: " +item.new + " dup: " + item.duplicate)
                if (item.new == true){
                    a.splice(0,0,item);
                }
                if (item.duplicate == true){
                    Vue.set(a, item.idx, item)
                }
            });
        },

        showDate : function (timer){
            var date = new Date(timer * 1000)
            var day  = date.getDate ()
            day = (day >= 10 ? day : "0" + day)
            var month = date.getMonth () + 1
            month = (month >= 10 ? month : "0" + month)
            var year = date.getFullYear ()
            return day + "." + month + "." + year
        },
        
        getDate : function (timer) {
                return new Date(timer * 1000)
        },
        
        showTime : function (timer){
                var date = new Date(timer * 1000)
                var hours = date.getUTCHours()
                hours = (hours >= 10 ? hours : "0" + hours)
                var minutes = date.getUTCMinutes ()
                var seconds = date.getUTCSeconds ()
                minutes = seconds < 30 ? minutes : minutes + 1
                minutes = (minutes >= 10 ? minutes : "0" + minutes)
                return hours + ":" + minutes
        },
        
        showTimeSeconds : function (timer){
                return timer
        },

        showDuration : function (line) {
            var duration = line.landingTime - line.takeoffTime
            return this.showTime(duration)
        },
        
        entryEdit : function ( line, index ){
            //Vue.set(this.new, index, true)
        },

        entrySave : function ( line, index ){
            localStorage.favpilot = line.pilot;
            this.submitEntry(line, index);
        },
        
        entryDelete : function ( line, index ){
            this.deleteEntry(line, index);
        },

        readFlightLog : function () {
            let acturl = this.sreadurl;
            if (this.debug == 1){
                acturl = acturl + '&debug=1'
            }
            
            axios.get( acturl
                ).then(response =>
                {
                    this.allflights  = response.data.reverse()
                    //console.log(this.allflights)
                }).catch(function(){
                    // eslint-disable-next-line
                    console.log('READ ERROR!' + error);
                });
                this.clearAllFlags()
          },

        clearAllFlags : function (){
            this.allflights.forEach( function( flight ) {
                flight.duplicate = false
                flight.new = false
            });
        },

        submitEntry : function (data, index){
            let acturl = this.supdateurl;
            if (this.debug == 1){
                acturl = acturl + '&debug=1'
            }
            
            axios.post( acturl, data, {
                headers: {
                     'Content-Type': 'application/json',
                }
                
            }).then(response => {                
                data.duplicate=false
                data.new=false
                Vue.set(this.allflights, index, data)
            })
            .catch(error => {
                // eslint-disable-next-line
                console.log(error);
            });
        },
        
        deleteEntry : function (data, index){
            let acturl = this.sdeleteurl;
            if (this.debug == 1){
                acturl = acturl + '&debug=1'
            }
            // console.log(acturl)
            axios.post( acturl, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        
        }).then(response => {
            Vue.delete(this.allflights, index)
        })
        .catch(function(){
            // eslint-disable-next-line
            console.log('FAILURE DELETE!' + error);
        });
        },
        
        submitFile(){
            this.clearAllFlags()
            let formData = new FormData();
            let acturl = this.screateurl;
            if (this.debug == 1){
                acturl = acturl + '&debug=1'
            }

            formData.append('file', this.file);
            axios.post( acturl,
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            }
            ).then(response => {
                this.info = response.data
                this.fetchNewFlights(this.info)
                this.$refs.file.reset()
            })
            .catch( error => {
                console.log ( error )
            });
        },
        handleFileUpload(){
            this.file = this.$refs.file.$refs.input.files[0]
            this.submitFile()
        }

    }
}

</script>

<style>

.hidden {
visibility : hidden;
}

.small-button {
    border: 1px solid;
    background-color: white;
}

.log-button {
    width: 120px;
    background-color: lightgrey;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
    cursor: pointer;
}


[v-cloak] {
  display: none;
}
.edit {
  display: none;
}
.editing .edit {
  display: block
}
.editing .view {
  display: none;
}

.data-container {
margin : auto;
}

</style>
