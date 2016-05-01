<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div style="text-align: center;">{{elevator.name}}</div>
  <div class="elevator-container">
    <div v-for="floor in floorArr" v-on:click="open()" class="floor-container">
      <div class="elevator-door left"
           v-bind:class="{ 'open': elevator.isDoorOpen && elevator.floor == floor.name }"></div>
      <div class="elevator-door right"
           v-bind:class="{ 'open': elevator.isDoorOpen && elevator.floor == floor.name }"></div>
    </div>
    <div v-on:click="operate()" class="elevator-instance"
         v-bind:style="{ bottom: (elevator.floor - 1) * 50 + 'px' }"></div>
  </div>
</template>

<style>
  .floor-container {
    position: relative;
    height: 50px;
  }

  .elevator-container {
    position: relative;
  }

  .elevator-instance {
    position: absolute;
    width: 100%;
    height: 50px;
    background-color: rgba(255, 165, 0, 0.5);
    transition: 3s all ease-in-out;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .elevator-door {
    position: absolute;
    width: 40%;
    top: 3%;
    bottom: 3%;
    background-color: rgba(169, 169, 169, 0.5);
    transition: 0.5s all ease-in-out;
    box-sizing: border-box;
  }

  .elevator-door.left {
    left: 10%;
    border-right: 1px solid gray;
  }

  .elevator-door.right {
    right: 10%;
    border-left: 1px solid gray;
  }

  .elevator-door.open {
    width: 5%;
  }

</style>

<script type="text/ecmascript-6">
  import cluster from '../cluster'

  export default {
    props: ['index'],
    created () {
      this.elevator = cluster.getElevator(this.index)
      console.log(this.index, this.elevator)
      for (var i = 0; i < this.elevator.floors; i++) {
        this.floorArr[i] = {name: this.elevator.floors - i}
      }
    },
    ready () {
    },
    data () {
      return {
        elevator: {},
        floorArr: []
      }
    },
    methods: {
      open () {
        this.elevator.isDoorOpen = !this.elevator.isDoorOpen
      },
      operate () {
        console.log('operate')
      }
    },
    components: {}
  }
</script>
