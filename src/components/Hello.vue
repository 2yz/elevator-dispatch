<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>{{elevator.value}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['name'],
    ready () {
      console.log(this.name)
      this.elevator = elevator.getElevator(this.name)
      setTimeout(() => {
        console.log('in:', this.elevator)
      }, 1500)
    },
    data () {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        msg: 'Hello World!',
        elevator: {}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>
