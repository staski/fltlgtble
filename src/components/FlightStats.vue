<template>
  <div>
    <b-card class="mt-3" bg-variant="light">
        <b-card-body>
            <b-card-title>Flight Statistics</b-card-title>
        </b-card-body>
 
        <b-list-group flush>
            <b-list-group-item > Total time: {{ stats.elapsedMinutes}} minutes</b-list-group-item>
            <b-list-group-item > Block time: {{ this.blockTime() }} minutes</b-list-group-item>
            <b-list-group-item > Taxi time: {{ stats.taxiMinutes + stats.restMinutes }} minutes 
                (thereof {{ stats.restMinutes }} minutes at rest)
                </b-list-group-item>
            <b-list-group-item > Flying time: {{ stats.flyingMinutes }} minutes ({{ stats.climbMinutes }} minutes climb,
                {{ stats.levelMinutes }} minutes level flight,
                {{ stats.descendMinutes }} minutes descend) </b-list-group-item>
            <b-list-group-item > Maximum altitude : {{ stats.altMax }} feet</b-list-group-item>
            <b-list-group-item > Flight distance: {{ stats.flightDistanceNM }} NM</b-list-group-item>
            <b-list-group-item > Maximum speed : {{ stats.speedMax }} kts</b-list-group-item>
            <b-list-group-item > Average speed : {{ this.avgSpeed() }} kts</b-list-group-item>

        </b-list-group>
    </b-card>
  </div>
</template>

<script>

//import FlUtils from '../flutils.js'

export default {
    name: 'Flight-Stats',
    props: {
        stats : Object
    },
    methods : {
            blockTime () {
                return Number(this.stats.flyingMinutes) + Number(this.stats.taxiMinutes) + Number(this.stats.restMinutes)
            },
            avgSpeed () {
                return Math.round(3600 * this.stats.flightDistanceNM / (this.stats.flyingMinutes * 60))
            }
    }
}
 </script>
