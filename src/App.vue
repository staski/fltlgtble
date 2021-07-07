/* eslint-disable no-console */
<template>
<div class="app">
<div>
<b-navbar toggleable="lg" variant="dark" type="dark">
    <b-navbar-brand href="#" class="mr-5">
        LogThisFlight
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
    <b-navbar-nav class="ml-auto">
    <b-btn @click="handleLogExport()" class="mx-1"><b-icon icon="file-spreadsheet" aria-hidden="true"></b-icon> Export
    </b-btn>
    <b-btn @click="handleLogRead()" class="mx-1"><b-icon icon="arrow-repeat" aria-hidden="true"></b-icon> Refresh</b-btn>
    <b-btn class="mx-1" v-if="false"><b-icon icon="gear-fill" aria-hidden="true"></b-icon> Settings</b-btn>
    <b-btn @click="uploadVisible = !uploadVisible"
        :class="uploadVisible ? null : 'collapsed'"
        class="mx-1">
        <b-icon icon="upload" aria-hidden="true"></b-icon>
        Upload
    </b-btn>
    </b-navbar-nav>
    </b-collapse>
</b-navbar>
 <b-collapse id="collapse-upload" v-model="uploadVisible">
    <b-card class="mt-3" bg-variant="light">
    <b-form>
        <b-form-row>
            <b-form-group class="mx-1" id="input-group-pilot" label="Pilot" label-for="input-pilot">
               <b-form-select
                    v-model="favpilot"
                    :options=pilots
                    id="input-pilot"
                    required
                ></b-form-select>
             </b-form-group>
            <b-form-group class="mx-1" id="input-group-plane" label="Plane" label-for="input-plane">
               <b-form-select
                    v-model="favplane"
                    :options=planes
                    id="input-plane"
                    required
                ></b-form-select>
             </b-form-group>
            <b-form-group class="mx-1" id="input-group-rules" label="Flight Rules" label-for="input-rules">
               <b-form-select
                    v-model="favrules"
                    :options=rules
                    id="input-rules"
                    required
                ></b-form-select>
             </b-form-group>
            <b-form-group class="mx-1" id="input-group-function" label="Function" label-for="input-function">
               <b-form-select
                    v-model="favfunction"
                    :options=functions
                    id="input-function"
                    required
                ></b-form-select>
             </b-form-group>
            <b-form-group class="mx-1" id="input-group-file" label="File" label-for="input-file">
                <b-form-file
                    id="input-file"
                    v-model="files"
                    ref="file"
                    placeholder="chose gpx file..."
                    drop-placeholder="Drop file here..."
                    accept=".gpx"
                    multiple
                    @change="handleFileUpload()">
                </b-form-file>
            </b-form-group>
         </b-form-row>
    </b-form>
 
    </b-card>
</b-collapse>

</div>

<flight-log-table :flight-segments="this.allflights"
                    :planes="planes"
                    :pilots="pilots"
                    :functions="functions"
                    :rules="rules"
                    ></flight-log-table>

</div>
</template>


    
<script>
const axios = require('axios');
import Vue from 'vue';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import FlUtils from './flutils.js'

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
        if (localStorage.favplane) {
          this.favplane = localStorage.favplane;
        }
        if (localStorage.favrules) {
          this.favrules = localStorage.favrules;
        }
        if (localStorage.favfunction) {
          this.favfunction = localStorage.favfunction;
        }

    },
    
    data () {
        return {
            uploadVisible : false,
            info : null,
            files: [],
            favpilot : '',
            favplane : '',
            favrules : '',
            favfunction : '',
            pilots : [
                { text: "CP", value: 'CP'},
                { text: "Markus", value: 'Markus'},
                { text: "Axel", value: 'Axel'},
                { text: "TestPilot", value: 'TestPilot'}
                ],
            planes : [
                { text: "DEEBU", value: 'DEEBU'},
                { text: "DEKAL", value: 'DEKAL'}
                ],
            rules : [
                { text: "VFR", value: 'VFR'},
                { text: "IFR", value: 'IFR'}
                ],
            functions : [
                { text: "PIC", value: 'PIC'},
                { text: "DUAL", value: 'DUAL'}
                ],
            allflights : [],
            exportcolumns :    [
                { label : "Date", field : "takeoffTime" , dataFormat: FlUtils.showDate },
                { label : "Plane", field : "plane" },
                { label : " Pilot", field : "pilot" },
                { label : "From", field : "departureAirport"},
                { label : "To" , field : "landingAirport" },
                { label : "Duration", field : "row" , dataFormat: this.showDuration },
                { label : "Starttime" , field : "takeoffTime" },
                { label : "Landingtime" , field : "landingTime" }
                ],
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

        handleLogExport () {
            FlUtils.exportExcel (this.exportcolumns, this.allflights)
        },
        
        handleLogRead() {
            this.readFlightLog()
        },
        
        showDuration : function (line) {
            var duration = line.landingTime - line.takeoffTime
            return FlUtils.showTime(duration)
        },

        entrySave : function ( line, index ){
            localStorage.favpilot = line.pilot;
            localStorage.favplane = line.plane;
            localStorage.favrules = line.rules;
            localStorage.favfunction = line.function;
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
                    console.log(this.allflights)
                }).catch(function(error){
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
        
        deleteEntry (data, index){
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
            }).catch(function(){
                // eslint-disable-next-line
                console.log('FAILURE DELETE!' + error);
            });
        },
        
        async handleFileUpload(){
            this.uploadVisible = false
            this.files = Array.from(this.$refs.file.$refs.input.files)
            
            for (let i = 0; i < this.files.length; i++){
                //console.log(this.files[i])
                await this.submitFile(this.files[i])
            }
            this.$refs.file.reset()
        },

        async submitFile(file){
            //this.clearAllFlags()
            let formData = new FormData();
            let acturl = this.screateurl;
            if (this.debug == 1){
                acturl = acturl + '&debug=1'
            }

            formData.append('file', file);
            formData.append('pilot', this.favpilot)
            formData.append('plane', this.favplane)
            formData.append('rules', this.favrules)
            formData.append('function', this.favfunction)
            try {
                console.log("before")
                const response = await axios.post(acturl,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                this.info = response.data
                console.log(this.info)
                this.fetchNewFlights(this.info)
            } catch (error){
                console.log ( error )
            }
        },

        fetchNewFlights(myInfo) {
            var p = this.pilots
            var a = this.allflights
            myInfo.forEach(function(item){
                item.duplicate = item.new = false
                //console.log("pilot from server = " + item.pilot)
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
