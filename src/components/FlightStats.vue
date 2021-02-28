<template>
  <div>
    <b-card class="mt-3" bg-variant="light">
        <b-card-body>
            <b-card-title>Flight Statistics</b-card-title>
        </b-card-body>
 
        <b-list-group flush>
            <b-list-group-item > total flight distance: {{ stats.flightDistanceNM }} NM</b-list-group-item>
            <b-list-group-item > total time: {{ stats.elapsedMinutes}} minutes</b-list-group-item>
            <b-list-group-item > block time: {{ stats.flyingMinutes + stats.taxiMinutes + stats.restMinutes }} minutes</b-list-group-item>
            <b-list-group-item > taxi time: {{ stats.taxiMinutes + stats.restMinutes }} minutes 
                (thereof {{ stats.restMinutes }} minutes at rest)
                </b-list-group-item>
            <b-list-group-item > flying time: {{ stats.flyingMinutes }} minutes ({{ stats.climbMinutes }} minutes climb,
                {{ stats.levelMinutes }} minutes level flight,
                {{ stats.descendMinutes }} minutes descend) </b-list-group-item>
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
    }
}
 </script>
