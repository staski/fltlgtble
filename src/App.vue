<template>
<div class="app">
<div class="top-bar">
<div class="upload-container">
<button @click="handleLogRead()" class="log-button">refresh</button>
</div>
<fl-upload v-bind:debug="this.debug_mode" v-bind:url="this.base_url" @send-result="fetchNewFlights($event)">
</fl-upload>
DEEBU Flight Log
</div>
<table class="flight-table">
    <thead>
        <th>Date</th>
        <th>Pilot</th>
        <th>From</th>
        <th>To</th>
        <th>Takeoff</th>
        <th>Landing</th>
        <th>Duration</th>
        <th>Landings</th>
        <th></th>
        <th></th>
    </thead>
    <tbody>
      <tr v-for="(lline,index) in allflights" :key="lline.id" :class="{editing: edits[index] == true}" v-cloak>
        <td>
            {{showDate(lline.takeoffTime)}}
        </td>
        <td>
          <div class="view">
            {{lline.pilot ? lline.pilot : "unknown" }}
          </div>
          <div class="edit">
            <select v-model="lline.pilot">
                <option> CP</option>
                <option> Markus</option>
                <option> Axel</option>
                <option> TestPilot</option>
            </select>
          </div>
        </td>
        <td>{{lline.departureAirport}}</td>
        <td>{{lline.landingAirport}}</td>
        <td>
            {{showTime(lline.takeoffTime)}}
        </td>
        <td>
            {{showTime(lline.landingTime)}}
        </td>
        <td>{{showDuration(lline)}}</td>
        <td>
            <div class="view">
                {{lline.landingCount}}
            </div>
            <div class="edit">
                <input type="Number" v-bind:value="lline.landingCount" v-on:input="lline.landingCount=$event.target.value" min="1" max="99">
            </div>
        </td>
        
        <td>
            <div class="view">
                          </div>
            <div class="edit">
                            </div>
        </td>
        <td>
            <div class="view">
                <button class="small-button" @click="entryEdit(lline,index)">Edit
                </button>
                <button class="hidden">None
                </button>
            </div>
            <div class="edit">
                <button class="small-button" @click="entrySave(lline, index)">Save
                </button>
                <button class="small-button" @click="entryDelete(lline,index)">Delete
                </button>

            </div>
        </td>
      </tr>
    </tbody>
</table>
</div>
</template>

<script>
const axios = require('axios');
import Vue from 'vue';
import FlUpload from './components/FlUpload.vue';
Vue.component('fl-upload', FlUpload);

export default {
    created: function () {
        // HTTP
        this.updateurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=update',
        this.deleteurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=delete',
        this.readurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=read',
        
        //HTTPS
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
            favpilot : '',
            pilots : [
                { name: "CP", id: 0, value: 'CP', mysel: false },
                { name: "Markus", id: 1, value: 'Markus', mysel: true },
                { name: "Axel", id: 2, value: 'Axel', mysel: false },
                { name: "TestPilot", id: 3, value: 'TestPilot', mysel: false }
                ],
            allflights : [],
            edits : [],
            debug_mode : process.env.VUE_APP_DEBUG_MODE == 1 ? 1 : 0,
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
        
        fetchNewFlights(myInfo) {
            var a = this.allflights
            var mySet = new Set()
            a.forEach(function ( flight ){
                mySet.add(flight.id)
            });
            var e = this.edits
            var p = this.pilots
            myInfo.forEach(function(item){
                item.pilot = item.pilot ? item.pilot : p[0].value
                if (mySet.has(item.id)){
                    console.log("duplicate id" + item.id)
                } else {
                    a.splice(0,0,item);
                    e.splice(0,0,true);
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
        
        showTime : function (timer){
                var date = new Date(timer * 1000)
                var hours = date.getUTCHours()
                hours = (hours >= 10 ? hours : "0" + hours)
                var minutes = date.getUTCMinutes ()
                minutes = (minutes >= 10 ? minutes : "0" + minutes)
                return hours + ":" + minutes
        },
        
        showTimeSeconds : function (timer){
                return timer
        },

        showDuration : function (line) {
            var duration = line.landingTime - line.takeoffTime
            var minutes = Math.floor(duration/60)
            var hours = Math.floor(duration/3600)
            minutes = minutes - 60 * hours
            var str_hours, str_minutes
            str_hours = Number(hours).toString()
            str_minutes = Number(minutes).toString()
            if (minutes < 10) {
                str_minutes = "0" + str_minutes;
            }
            return str_hours + ":" + str_minutes
        },
        
        entryEdit : function ( line, index ){
            Vue.set(this.edits, index, true)
        },

        entrySave : function ( line, index ){
            localStorage.favpilot = line.pilot;
            this.submitEntry(line, index);
        },
        
        entryDelete : function ( line, index ){
            this.deleteEntry(line, index);
        },

        readFlightLog : function () {
            if (this.debug == 1){
                this.sreadurl = this.sreadurl + '&debug=1'
            }
            
            axios.get( this.sreadurl
                ).then(response =>
                {
                    this.allflights  = response.data.reverse()
                }).catch(function(){
                    // eslint-disable-next-line
                    console.log('READ ERROR!');
                });
        },
            
        submitEntry : function (data, index){
            if (this.debug == 1){
                this.supdateturl = this.supdateurl + '&debug=1'
            }

            axios.post( this.supdateurl, data, {
                headers: {
                     'Content-Type': 'application/json',
                }
                
            }).then(response => {
                Vue.set(this.edits, index, false)
            })
            .catch(function(){
                // eslint-disable-next-line
                console.log('FAILURE!!');
            });
        },
        
        deleteEntry : function (data, index){
            if (this.debug == 1){
                this.sdeleturl = this.sdeleteurl + '&debug=1'
            }
            
            axios.post( this.sdeleteurl, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        
        }).then(response => {
            Vue.set(this.edits, index, false)
            this.readFlightLog ()
        })
        .catch(function(){
            // eslint-disable-next-line
            console.log('FAILURE!!');
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
.top-bar {
    display: flex;
    align-items: baseline;
    margin: auto;
    background-color: IndianRed;
    width: 90%;
    min-width: 970px;
    font-family : Arial;
    font-size: 20px;
    font-weight: bold;
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

.flight-table {
    table-layout: fixed;
    border-collapse : collapse;
    border : 1px solid ;
    width : 90%;
    margin : auto;
}

th {
    border : 1px solid;
    text-align: left;
    padding: 8px;
    font-family : Arial;
    background-color : IndianRed;
    width: 80px;
}

td {
    border : 1px solid;
    text-align: left;
    padding: 8px;
    font-family : Arial;
    overflow : hidden;
}

tr:nth-child(even) {background-color: IndianRed;}

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
