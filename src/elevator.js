import {STATE, DIRECTION} from './constant'

class Elevator {
  constructor (cluster, index, name, floor, floors) {
    this._cluster = cluster
    this.index = index
    this.name = name || 'Elevator'
    this.floor = floor || 1
    this.floors = floors || 20
    // this.targetFloor = 0
    this.enabled = true
    this.state = STATE.NULL // State: run wait idle stop
    this.direction = null // Direction: 'up' 'down' null
    this.isDoorOpen = false
    this._request = []
    for (var i = 1; i <= this.floors; i++) {
      this._request[i] = false
    }
    this._warn = false
    this._run = null
    this._wait = null
    this._idle = null
    this.enter(STATE.IDLE)
  }
  change (state) {
    this.exit()
    this.enter(state)
  }
  enter (state) {
    this.state = state
    switch (state) {
      case STATE.RUN:
        this.enterRun()
        break
      case STATE.WAIT:
        this.enterWait()
        break
      case STATE.IDLE:
        this.enterIdle()
        break
      case STATE.STOP:
        this.enterStop()
        break
    }
  }
  exit () {
    switch (this.state) {
      case STATE.RUN:
        this.exitRun()
        break
      case STATE.WAIT:
        this.exitWait()
        break
      case STATE.IDLE:
        this.exitIdle()
        break
      case STATE.STOP:
        this.exitStop()
        break
    }
    this.state = STATE.NULL
  }
  enterRun () {
    this.run()
  }
  run () {
    if (this.direction === DIRECTION.NULL) {
      if (this._isRequestAbove()) {
        this.direction = DIRECTION.UP
      } else if (this._isRequestBelow()) {
        this.direction = DIRECTION.DOWN
      } else if (this._isRequestOnThisFloor()) {
        this.change(STATE.WAIT)
        return
      } else {
        this.change(STATE.IDLE)
        return
      }
    } else {
      if (this._isRequestOnDirection()) {
        if (this._isRequest(this.floor, this.direction)) {
          this.change(STATE.WAIT)
          return
        }
      } else if (this._isRequest(this.floor, this._getOppositeDirection())) {
        this.direction = this._getOppositeDirection()
        this.change(STATE.WAIT)
        return
      } else if (this._isRequestOppoDirection()) {
        this.direction = this._getOppositeDirection()
      } else {
        this.change(STATE.IDLE)
      }
    }
    var nextFloor
    if (this.direction === DIRECTION.UP) {
      nextFloor = this.floor + 1
    } else if (this.direction === DIRECTION.DOWN) {
      nextFloor = this.floor - 1
    }
    if (!nextFloor || nextFloor < 1 || nextFloor > this.floors) {
      this.change(STATE.IDLE)
      return
    }
    console.log('run:', this.index, nextFloor, this.direction)
    if (this._isRequest(nextFloor, this.direction)) {
      this.changeDispatch(nextFloor, this.direction)
      this._run = setTimeout(() => {
        // TODO set elevator velocity
        this.change(STATE.WAIT)
      }, 1000)
    } else {
      this._run = setTimeout(() => {
        // TODO set elevator velocity
        this.run()
      }, 1000)
    }
    this.floor = nextFloor
  }
  exitRun () {
    // TODO set elevator velocity
    clearTimeout(this._run)
    this._run = null
  }
  enterWait () {
    this.finishRequest(this.floor, this.direction)
    this.isDoorOpen = true
    this._wait = setTimeout(() => {
      this.isDoorOpen = false
      this._wait = setTimeout(() => {
        this.change(STATE.RUN)
      }, 500)
    }, 500)
  }
  exitWait () {
    clearTimeout(this._wait)
    this._wait = null
  }
  enterIdle () {
    this.direction = DIRECTION.NULL
    this._idle = setInterval(() => {
      this.idle()
    }, 1000)
  }
  idle () {
    if (this._isRequestOnThisFloor()) {
      this.change(STATE.RUN)
    } else if (this._isAnyRequest()) {
      this.change(STATE.RUN)
    }
  }
  exitIdle () {
    if (this.isDoorOpen) this.isDoorOpen = false
    clearInterval(this._idle)
    this._idle = null
  }
  enterStop () {
    this.isDoorOpen = true
  }
  exitStop () {
    this.isDoorOpen = false
  }
  warn () {
    this._warn = true
    if (this.state === STATE.STOP) return
    if (this.state === STATE.RUN) {
      setTimeout(() => {
        this.warn()
      }, 500)
    } else {
      this.change(STATE.STOP)
    }
  }
  dismissWarn () {
    this._warn = false
    this.change(STATE.IDLE)
  }
  openDoor () {
    if (this.state !== STATE.RUN) {
      this.isDoorOpen = true
    }
  }
  closeDoor () {
    if (this.state !== STATE.RUN) {
      this.isDoorOpen = false
    }
  }
  request (floor) {
    this._request.splice(floor, 1, true)
  }
  changeDispatch (floor, direction) {
    this._cluster.changeDispatch(floor, direction, this.index)
  }
  finishRequest (floor, direction) {
    this._request.splice(floor, 1, false)
    if (this.direction === DIRECTION.NULL) {
      if (this._cluster._request[floor][DIRECTION.UP]) {
        this._cluster.finishRequest(floor, DIRECTION.UP)
      } else if (this._cluster._request[floor][DIRECTION.DOWN]) {
        this._cluster.finishRequest(floor, DIRECTION.DOWN)
      }
    } else {
      this._cluster.finishRequest(floor, direction)
    }
  }
  getTargetFloor () {
    if (this.direction === DIRECTION.UP) return this._getTargetFloorAbove()
    if (this.direction === DIRECTION.DOWN) return this._getTargetFloorBelow()
    return this.floor
  }
  _getTargetFloorAbove () {
    for (var i = this.floors; i >= this.floor; i--) {
      if (this._cluster._dispatch[i]['up'] === this.index || this._cluster._dispatch[i]['down'] === this.index || this._request[i]) return i
    }
    return this.floor
  }
  _getTargetFloorBelow () {
    for (var i = 1; i <= this.floor; i++) {
      if (this._cluster._dispatch[i]['up'] === this.index || this._cluster._dispatch[i]['down'] === this.index || this._request[i]) return i
    }
    return this.floor
  }
  _isRequest (floor, direction) {
    console.log('_isRequest', this.index, floor, direction)
    return this._cluster._request[floor][direction] || this._request[floor]
  }
  _isRequestOnThisFloor () {
    return this._cluster._request[this.floor][DIRECTION.UP] || this._cluster._request[this.floor][DIRECTION.DOWN] || this._request[this.floor]
  }
  _isAnyRequest () {
    for (var i = 1; i <= this.floors; i++) {
      if (this._cluster._dispatch[i]['up'] === this.index || this._cluster._dispatch[i]['down'] === this.index || this._request[i]) return true
    }
    return false
  }
  _isRequestOnDirection () {
    if (this.direction === 'up') return this._isRequestAbove()
    if (this.direction === 'down') return this._isRequestBelow()
    return false
  }
  _isRequestOppoDirection () {
    if (this.direction === 'down') return this._isRequestAbove()
    if (this.direction === 'up') return this._isRequestBelow()
    return false
  }
  _isRequestAbove () {
    for (var i = this.floor + 1; i <= this.floors; i++) {
      if (this._cluster._dispatch[i]['up'] === this.index || this._cluster._dispatch[i]['down'] === this.index || this._request[i]) return true
    }
    return false
  }
  _isRequestBelow () {
    for (var i = this.floor - 1; i >= 1; i--) {
      if (this._cluster._dispatch[i]['up'] === this.index || this._cluster._dispatch[i]['down'] === this.index || this._request[i]) return true
    }
    return false
  }
  _getOppositeDirection () {
    if (this.direction === DIRECTION.UP) return DIRECTION.DOWN
    if (this.direction === DIRECTION.DOWN) return DIRECTION.UP
    return null
  }
}

export default Elevator
