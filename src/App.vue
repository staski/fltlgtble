<template>
<div class="app">
<div class="top-bar">
<div class="upload-container">
<button @click="handleLogRead()" class="log-button">refresh</button>
</div>
<fl-upload v-bind:debug="this.debug_mode" v-bind:url="this.base_url" @send-result="fetchNewFlights($event)">
</fl-upload>
DEEBUG Flight Log
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
        <th>Landing Count</th>
        <th></th>
        <th></th>
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
                <input type="Number" v-bind:value="lline.landingCount" v-on:input="lline.landingCount=$event.target.value">
            </div>
        </td>
        
        <td>
            <div class="view">
                <button @click="entryEdit(lline,index)">Edit</button>
            </div>
            <div class="edit">
                <button @click="entrySave(lline, index)">Save</button>
            </div>
        </td>
        <td><div class="edit">
            <button @click="entryDelete(lline,index)">Delete</button></div></td>
        <td></td>
        <td></td>

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
        this.updateurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=update' + '&debug=' + this.debug_mode,
        this.deleteurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=delete' + '&debug=' + this.debug_mode,
        this.readurl = 'http://' + this.base_url + '/mngfltlg.cgi?action=read' + '&debug=' + this.debug_mode,

        this.supdateurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=update' + '&debug=' + this.debug_mode,
        this.sdeleteurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=delete' + '&debug=' + this.debug_mode,
        this.sreadurl = 'https://' + this.base_url + '/mngfltlg.cgi?action=read' + '&debug=' + this.debug_mode,
        
        this.base_url = 'https://' + this.base_url
    },
    
    mounted: function () {
        this.readFlightLog()
    },
    
    data () {
        return {
            selectedPilot : 'CP',
            pilots : [
                { name: "CP", id: 0, value: 'CP', mysel: false },
                { name: "Markus", id: 1, value: 'Markus', mysel: true },
                { name: "Axel", id: 2, value: 'Axel', mysel: false }
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
            // eslint-disable-next-line
            console.log(p[0].value)
            // eslint-disable-next-line
            console.log(p[0].name)
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

        //flightSaved (eventInfo){
        //    },
        
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
                var hours = date.getHours()
                hours = (hours >= 10 ? hours : "0" + hours)
                var minutes = date.getMinutes ()
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
            // eslint-disable-next-line
            console.log(index)
            Vue.set(this.edits, index, true)
        },

        entrySave : function ( line, index ){
            // eslint-disable-next-line
            console.log(index)
            this.submitEntry(line, index);
        },
        
        entryDelete : function ( line, index ){
            // eslint-disable-next-line
            console.log(index)
            this.deleteEntry(line, index);
        },

        readFlightLog : function () {
            console.log(this.readurl)
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
            // eslint-disable-next-line
            console.log(data)
            axios.post( this.supdateurl, data, {
                headers: {
                     'Content-Type': 'application/json',
                }
                
            }).then(response => {
                // eslint-disable-next-line
                console.log(response.data);
                Vue.set(this.edits, index, false)
                this.readFlightLog ()
            })
            .catch(function(){
                // eslint-disable-next-line
                console.log('FAILURE!!');
            });
        },
        
        deleteEntry : function (data, index){
            // eslint-disable-next-line
            console.log(data)
            axios.post( this.sdeleteurl, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        
        }).then(response => {
            // eslint-disable-next-line
            console.log(response.data);
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

.top-bar {
    display: flex;
    align-items: baseline;
    margin: auto;
    background-color: IndianRed;
    width: 90%;
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

table {
  border-collapse: collapse;
  width: 100%;
}
th {
    text-align: left;
    padding: 8px;
    font-family : Arial;
    background-color : IndianRed;
}

td {
    text-align: left;
    padding: 8px;
    font-family : Arial;
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

.upload-container {
}
.flight-table {
width : 90%;
margin : auto;
}
</style>
