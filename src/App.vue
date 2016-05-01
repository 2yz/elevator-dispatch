<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="am-g am-g-fixed">
    <div class="am-u-sm-2" style="padding: 0;text-align: center;">
      <div>楼层</div>
      <div v-for="floor in floorArr" class="floor-container am-vertical-align">
        <div class="am-vertical-align-middle">
          <div style="display:inline-block;width: 24px;text-align: center;">{{floor.name}}</div>
          <button v-on:click="request(floor.name,'up')" type="button" class="am-btn am-btn-default am-btn-xs" v-bind:class="{ 'active': cluster._request[floor.name]['up'] }">▲</button>
          <button v-on:click="request(floor.name,'down')" type="button" class="am-btn am-btn-default am-btn-xs" v-bind:class="{ 'active': cluster._request[floor.name]['down'] }">▼</button>
        </div>
      </div>
    </div>
    <div v-for="elevator in elevatorArr" class="am-u-sm-2">
      <elevator-vue :index="elevator.index"></elevator-vue>
    </div>
  </div>
</template>

<style>
  .floor-container {
    position: relative;
    height: 50px;
  }

  .am-btn.active {
    background-color: #ffa500;
  }
</style>

<script type="text/ecmascript-6">
  import Hello from './components/Hello.vue'
  import ElevatorVue from './components/Elevator.vue'
  import cluster from './cluster'
  import Elevator from './elevator'

  var floorNum = 20

  export default {
    created () {
      for (var i = 0; i < 5; i++) {
        var name = '电梯' + (i + 1)
        var elevator = new Elevator(cluster, i, name)
        cluster.setElevator(i, elevator)
        this.elevatorArr[i] = {index: i}
      }
      this.requestUp = cluster.requestUp
      this.requestDown = cluster.requestDown
      this.initFloorController(floorNum)
      this.cluster = cluster
      console.log(this.cluster)
    },
    ready () {
    },
    data () {
      return {
        test: {
          test: {
            a: 0
          }
        },
        floorArr: [],
        elevatorArr: [],
        cluster: {}
      }
    },
    methods: {
      initFloorController (num) {
        for (var i = 0; i < num; i++) {
          this.floorArr[i] = {name: num - i}
        }
      },
      request (name, direction) {
        cluster.request(name, direction)
      }
    },
    components: {
      Hello,
      ElevatorVue
    }
  }
</script>
