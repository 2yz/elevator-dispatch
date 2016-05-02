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
  <div class="am-modal am-modal-no-btn" tabindex="-1" id="elevator-{{elevator.index}}-panel">
    <div class="am-modal-dialog">
      <div class="am-modal-hd">
        {{elevator.name}}<a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>&times;</a>
      </div>
      <div class="am-modal-bd">
        <div style="width: 200px;margin: auto;">
          <div>
            <div v-for="floor in floorArr" class="elevator-btn-container">
              <button v-on:click="request(floor.name)" type="button" class="am-btn am-btn-sm elevator-btn"
                      v-bind:class="{ 'am-btn-default': !elevator._request[floor.name], 'am-btn-warning': elevator._request[floor.name] }">
                {{floor.name}}
              </button>
            </div>
          </div>
          <div>
            <button v-on:click="openDoor()" type="button" class="am-btn am-btn-sm elevator-btn am-btn-default">开</button>
            <button v-on:click="closeDoor()" type="button" class="am-btn am-btn-sm elevator-btn am-btn-default">关</button>
            <button v-on:click="warn()" type="button" class="am-btn am-btn-sm elevator-btn am-btn-default"><i class="am-icon-bell-o"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .elevator-btn-container {
    display: inline-block;
    padding: 3px;
  }

  .elevator-btn {
    width: 50px;
  }

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
    width: 39%;
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
  import $ from 'jquery'
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
      openDoor () {
        this.elevator.openDoor()
      },
      closeDoor () {
        this.elevator.closeDoor()
      },
      warn () {
        console.log('warn')
      },
      operate () {
        var id = `#elevator-${this.elevator.index}-panel`
        $(id).modal()
        console.log('operate')
      },
      request (floor) {
        this.elevator.request(floor)
      }
    },
    components: {}
  }
</script>
