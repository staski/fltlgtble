<template>
  <div>
    <b-table small striped hover :fields="fields" :items="flightSegments" responsive="sm">

      <template v-slot:cell(date)="data">
        {{ $parent.showDate(data.item.takeoffTime) }}
      </template>

    <template v-slot:cell(pilot)="data">
      {{ data.value}}
    </template>
    
    <template v-slot:cell(departureAirport)="data">
      {{ data.value }}
    </template>

    <template v-slot:cell(landingAirport)="data">
      {{ data.value }}
    </template>

    <template v-slot:cell(takeoffTime)="data">
      {{ $parent.showTime(data.item.takeoffTime) }}
    </template>

    <template v-slot:cell(landingTime)="data">
      {{ $parent.showTime(data.item.landingTime) }}
    </template>

    <template v-slot:cell(duration)="data">
      {{ $parent.showDuration(data.item) }}
    </template>

    <template v-slot:cell(landingCount)="data">
      {{ data.value }}
    </template>

    <template v-slot:cell(props)="data">
        <b-badge variant="success" v-if="$parent.edits[data.index]">New</b-badge>
    </template>
       
    <template v-slot:cell(edit)="data">
        <b-button size="sm" @click="showModal(data.item)" class="mr-2">
        Edit
        </b-button>
        <b-button size="sm" @click="entryDelete(data.item)" class="mr-2">
        Delete
        </b-button>
    </template>


    <!-- Optional default data cell scoped slot -->
    <template v-slot:cell()="data">
      <i>{{ data.value }}</i>
    </template>
    </b-table>


      <b-modal
          size="lg"
          id="modal-edit-segment"
          ref="modal-edit-segment"
          title="Edit Flight Segment"
          ok-title="Submit"
          cancel-title="Discard"
          @ok="handleOk"
      >
      
    <b-form>
        <b-form-row>
            <b-form-group class="px-1" id="input-group-plane" label="Plane" label-for="input-plane">
               <b-form-select
                 id="input-plane"
                 v-model="form.registration"
                 :options=planeoptions
                 required
               ></b-form-select>
             </b-form-group>

            <b-form-group class="px-1" id="input-group-pilot" label="Pilot" label-for="input-pilot">
               <b-form-select
                 id="input-pilot"
                 v-model="form.pilot"
                 :options="$parent.pilots"
                 text-field="name"
                 required
               ></b-form-select>
             </b-form-group>

             <b-form-group class="px-1" id="input-group-date" label="Date" label-for="input-date">
                 <b-form-datepicker
                     id="input-date"
                     v-model="form.date"
                     required
                     placeholder="Date"
                     :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                 ></b-form-datepicker>
             </b-form-group>
         </b-form-row>
    </b-form>
      
    <b-card class="mt-3" header="Flight Segment" bg-variant="light">
    
    <b-form-row>
        <b-form-group class="px-1" id="input-group-from" label="From" label-for="input-from">
            <b-form-input
               id="input-from"
               v-model="form.from"
               required
               placeholder="From"
             ></b-form-input>
       </b-form-group>

        <b-form-group class="px-1" id="input-group-offblock" label="Block Off" label-for="input-offblock">
            <b-form-timepicker
                id="input-offblock"
                v-model="form.offblock"
                required
                placeholder="Off Block Time"
            ></b-form-timepicker>
        </b-form-group>
       
       <b-form-group class="px-1" id="input-group-5" label="Takeoff" label-for="input-5">
           <b-form-timepicker
             v-model="form.takeoff"
             locale="de"
           ></b-form-timepicker>
         </b-form-group>
    
    <b-form-group class="px-1" id="input-group-hobbs-start" label="Hobbs Start" label-for="input-hobbs-start">
        <b-form-input
            type="number"
            id="input-hobbs-start"
            v-model="form.hobbsstart"
            required
            placeholder="Hobbs Start"
            step='0.01'
        ></b-form-input>
    </b-form-group>

    </b-form-row>

    <b-form-row>

      <b-form-group class="px-1" id="input-group-to" label="To" label-for="input-to">
         <b-form-input
           id="input-to"
           v-model="form.to"
           required
           placeholder="To"
         ></b-form-input>
       </b-form-group>

        <b-form-group class="px-1" id="input-group-onblock" label="Block On" label-for="input-onblock">
            <b-form-timepicker
                id="input-onblock"
                v-model="form.onblock"
                required
                placeholder="On Block Time"
            ></b-form-timepicker>
        </b-form-group>
    
        <b-form-group class="px-1" id="input-group-landing" label="Landing" label-for="input-landing">
            <b-form-timepicker
                id="input-landing"
                v-model="form.landing"
                required
                placeholder="Landing"
            ></b-form-timepicker>
        </b-form-group>

    
        <b-form-group class="px-1" id="input-group-hobbs-end"
            label="Hobbs End" label-for="input-hobbs-end">
              <b-form-input
                  type="number"
                  id="input-hobbs-end"
                  v-model="form.hobbsend"
                  required
                  placeholder="Hobbs End"
                  step='0.01'
              ></b-form-input>
        </b-form-group>

    </b-form-row>


    <b-form-row class="my-3">
      
    <b-form-group class="px-1" id="input-group-landings-day"
          label="Landings (Day)" label-for="input-landings-day">
            <b-form-input
                type="number"
                id="input-landings-day"
                v-model="form.landingcount"
                required
                placeholder="Landings Day"
                min="1" max="20"
            ></b-form-input>
        </b-form-group>
        
    <b-form-group classe="px-3" id="input-group-landings-night"
          label="Landings (Night)" label-for="input-landings-night">
            <b-form-input
                type="number"
                id="input-landings-night"
                required
                placeholder="0"
                min="0" max="20"
            ></b-form-input>
        </b-form-group>

    <b-form-group class="px-3" label="Flight Rules">
        <b-form-radio-group
            v-model=form.rules
            :options="rulesoptions"
        ></b-form-radio-group>
    </b-form-group>
    
    <b-form-group class="px-3" label="Function">
        <b-form-select
            v-model=form.function
            :options="functionoptions"
        ></b-form-select>
    </b-form-group>

    <b-form-group class="px-3" id="timer-flight" label="Flight Time" label-for="timer-flight">
        <b-form-timepicker
            id="timer-flight"
            v-model="form.vfrtime"
            required
            placeholder="Flight Time"
        ></b-form-timepicker>
    </b-form-group>

    </b-form-row>
    
    </b-card>
    <b-button v-b-toggle="'collapse-timers'" class="m-1">Timers</b-button>
    <b-button v-b-toggle="'collapse-refuel'" class="m-1">Refuel</b-button>
    <b-collapse id="collapse-refuel">
    <b-card class="mt-3" bg-variant="light">
        test
    </b-card>
    </b-collapse>
    <b-collapse id="collapse-timers">
    <b-card class="mt-3" bg-variant="light">
    <b-form-row>
    <b-form-group class="px-1" id="timer-vfr" label="VFR Time" label-for="timer-vfr">
        <b-form-timepicker
            id="timer-vfr"
            v-model="form.vfrtime"
            required
            placeholder="Landing"
        ></b-form-timepicker>
    </b-form-group>

    <b-form-group class="px-1" id="timer-ifr" label="IFR Time" label-for="timer-ifr">
        <b-form-timepicker
            id="timer-ifr"
            v-model="form.landing"
            required
            placeholder="Landing"
        ></b-form-timepicker>
    </b-form-group>

    <b-form-group class="px-1" id="timer-airborne" label="Airborne Time" label-for="timer-airborne">
        <b-form-timepicker
            id="timer-airborn"
            v-model="form.landing"
            required
            placeholder="Landing"
        ></b-form-timepicker>
    </b-form-group>

    <b-form-group class="px-1" id="timer-pic" label="PIC Time" label-for="timer-airborne">
        <b-form-timepicker
            id="timer-pic"
            v-model="form.landing"
            required
            placeholder="Landing"
        ></b-form-timepicker>
    </b-form-group>

    <b-form-group class="px-1" id="timer-dual" label="Dual Time" label-for="timer-dual">
        <b-form-timepicker
            id="timer-dual"
            :value="form.landing"
            required
            placeholder="Landing"
        ></b-form-timepicker>
    </b-form-group>

    </b-form-row>
    </b-card>
    </b-collapse>

    </b-modal>
  </div>
</template>

<script>
  export default {
    name: 'Flight-Log-Table',
    props: {
        debug : Number,
        flightSegments : Array
        },
    data() {
      return {
        functionoptions : [
                { text: 'PIC', value: 'PIC'},
                { text: 'DUAL', value: 'DUAL' }
        ],
        rulesoptions : [
                { text: 'VFR', value: 'VFR'},
                { text: 'IFR', value: 'IFR' }
        ],
        planeoptions : [
          { text: 'DEEBU', value: 'DEEBU'},
          { text: 'DEKAL', value: 'DEKAL'}
        ],
        form : {
            type: '',
            registration : '',
            pilot: '',
            date : '',
            from : '',
            to : '',
            offblock : '',
            takeoff : '',
            landing : '',
            onblock : '',
            duration : '',
            hobbsstart : '0.00',
            hobbsend : '0.00',
            landingcount : '',
            rules : '',
            function : '',
            vfrtime : 0,
            ifrtime : 0,
            airbornetime : 0,
            pictime : 0,
            dualtime : 0
        },
        pilots : [
            { name: "CP", id: 0, value: 'CP', mysel: false },
            { name: "Markus", id: 1, value: 'Markus', mysel: true },
            { name: "Axel", id: 2, value: 'Axel', mysel: false },
            { name: "TestPilot", id: 3, value: 'TestPilot', mysel: false }
            ],
        show : true,
        selectedItem: null,
        fields: [
          // A virtual column that doesn't exist in items
            'date',
            'pilot',
          { key: 'departureAirport', label: 'From' },
          { key: 'landingAirport', label: 'To' },
          { key: 'takeoffTime', label: 'Takeoff' },
          { key: 'landingTime', label: 'Landing' },
            'duration',
            'landingCount',
          { key: 'props', label : ''},
          { key: 'edit', label: ''}
        ]
      }
    },
    methods : {
        showModal(item) {
            this.selectedItem=item
            this.form.type = 'SEP'
            this.form.registration = item.plane
            this.form.pilot = item.pilot
            this.form.from = item.departureAirport
            this.form.to = item.landingAirport
            this.form.date = this.$parent.getDate(item.takeoffTime)
           
            this.form.offblock = this.$parent.showTime(item.offBlock)
            this.form.takeoff = this.$parent.showTime(item.takeoffTime)
            this.form.landing = this.$parent.showTime(item.landingTime)
            this.form.onblock = this.$parent.showTime(item.onBlock)
            this.form.landingcount = item.landingCount
            this.form.duration = this.$parent.showDuration(item)
            this.form.rules='VFR'
            this.form.function='PIC'
            this.form.vfrtime = this.$parent.showTime(item.landingTime - item.takeoffTime)
            this.$refs['modal-edit-segment'].show()
        },

        handleOk(evt) {
          var litem = this.selectedItem
          var lform = this.form

          var takeoff = lform.date
          console.log("HALLO: " + takeoff)
          var year = takeoff.getUTCFullYear()
          var month = takeoff.getUTCMonth()
          var day = takeoff.getUTCDate()
          
          var offBlock, takeoffTime, landingTime, onBlock;

          offBlock = takeoffTime = landingTime = onBlock =
            new Date(Date.UTC(year, month, day));

          console.log("DATE: " + offBlock )
          litem.plane = lform.registration
          litem.type = lform.type
          litem.pilot = lform.pilot
          litem.departureAirport = lform.from
          litem.landingAirport = lform.to
          
          
          litem.offBlock = this.setTimeFromForm(lform.offblock, offBlock).getTime() / 1000
          litem.takeoffTime = this.setTimeFromForm(lform.takeoff, takeoffTime).getTime()/1000
          litem.landingTime = this.setTimeFromForm(lform.landing, landingTime).getTime() / 1000
          litem.onBlock = this.setTimeFromForm(lform.onblock, onBlock).getTime() / 1000


          litem.landingCount = lform.landingcount
          litem.rules = lform.rules
          litem.function = lform.function

          this.$parent.entrySave (litem, 0)

          //alert(JSON.stringify(this.selectedItem))
        },
        setTimeFromForm(form, item){
          
          console.log("SET: " + item)
          item.setUTCHours(form.slice(0,2))
          item.setUTCMinutes(form.slice(3,5))
          
          return item
        },

        entryDelete(item){
          this.$parent.entryDelete(item,0)
        }
        
        
    }
  }
</script>
