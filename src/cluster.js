class Cluster {
  constructor (floors) {
    this.floors = floors || 20
    this.elevator = []
    this._request = []
    this._dispatch = []
    for (var i = 1; i <= this.floors; i++) {
      this._request[i] = {'up': false, 'down': false}
      this._dispatch[i] = {'up': null, 'down': null}
    }
    this._update = setInterval(() => {
      this.update()
    }, 5000)
  }
  update () {
    for (var i = 1; i <= this.floors; i++) {
      if (this._request[i]['up'] && this._dispatch[i]['up'] === null) {
        this.dispatchElevator(i, 'up')
      }
      if (this._request[i]['down'] && this._dispatch[i]['down'] === null) {
        this.dispatchElevator(i, 'down')
      }
    }
  }
  dispatchElevator (floor, direction) {
    var selectedElevator = 0
    var minDistance = Number.MAX_VALUE
    for (var i = 0; i < this.elevator.length; i++) {
      var elevator = this.elevator[i]
      var distance = Number.MAX_VALUE
      if (elevator.direction === null || elevator.direction === direction) {
        distance = Math.abs(floor - elevator.floor)
      } else {
        distance = Math.abs(elevator.getTargetFloor() - floor) + Math.abs(elevator.getTargetFloor() - elevator.floor)
      }
      if (distance < minDistance) {
        selectedElevator = i
        minDistance = distance
      }
    }
    console.log('dispatchElevator:', selectedElevator)
    this._dispatch[floor][direction] = selectedElevator
    if (this.elevator[selectedElevator].direction === null) {
      var delta = floor - this.elevator[selectedElevator].floor
      if (delta > 0) {
        this.elevator[selectedElevator].run()
      } else if (delta < 0) {
        this.elevator[selectedElevator].run()
      } else {
        this.elevator[selectedElevator].open(direction)
      }
    }
  }
  request (name, direction) {
    this._request[name][direction] = true
    this.update()
  }
  finishRequest (name, direction) {
    this._request[name][direction] = false
    this._dispatch[name][direction] = null
  }
  setElevator (index, elevator) {
    this.elevator[index] = elevator
  }
  getElevator (index) {
    return this.elevator[index]
  }
}

var cluster = new Cluster()

export default cluster
