export default class Elevator {
  constructor (cluster, index, name, floor, floors) {
    this._cluster = cluster
    this.index = index
    this.name = name || 'Elevator'
    this.floor = floor || 1
    this.floors = floors || 20
    // this.targetFloor = 0
    this.enabled = true
    this.state = 'idle' // State: run wait idle stop
    this.direction = null // Direction: 'up' 'down' null
    this.isDoorOpen = false
    this._request = []
    for (var i = 1; i <= this.floors; i++) {
      this._request[i] = false
    }
  }
  run () {
    if (this.state !== 'run') {
      this.state = 'run'
      this._setDirection()
      this._move()
    }
  }
  open (reqDirection) {
    this.state = 'run'
    this.direction = reqDirection
    this._wait()
  }
  request (floor) {
    this._request.splice(floor, 1, true)
    this.run()
  }
  getTargetFloor () {
    if (this.direction === 'up') return this._getTargetFloorAbove()
    if (this.direction === 'down') return this._getTargetFloorBelow()
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
  _move () {
    this.state = 'run'
    console.log('_move:', this.name)
    var tmp
    if (this.direction === 'up') {
      tmp = this.floor + 1
    } else if (this.direction === 'down') {
      tmp = this.floor - 1
    }
    if (tmp < 1 || tmp > this.floors) {
      this._idle()
      return
    }
    this.floor = tmp
    setTimeout(() => {
      if (this._isRequestOnFloor()) {
        this._wait()
      } else if (this._isRequestOnDirection()) {
        this._move()
      } else if (this._isRequestOppoDirection()) {
        this.direction = this.getOppositeDirection()
        this._move()
      } else {
        this._idle()
      }
    }, 3000)
  }
  _idle () {
    this.state = 'idle'
    this.direction = null
  }
  _wait () {
    this.state = 'wait'
    this.finishRequest(this.floor, this.direction)
    this.isDoorOpen = true
    setTimeout(() => {
      this.isDoorOpen = false
    }, 1500)
    setTimeout(() => {
      if (this._isRequestOnDirection()) {
        this._move()
      } else if(this._isRequestOppoDirection()) {
        this.direction = this.getOppositeDirection()
        this._move()
      } else {
        this._idle()
      }
    }, 3000)
  }
  finishRequest (floor, direction) {
    this._request.splice(floor, 1, false)
    this._cluster.finishRequest(floor, direction)
  }
  _isRequestOnFloor () {
    var clusterReq = this._cluster._request[this.floor]
    console.log('_isRequestOnFloor:', this.floor, clusterReq[this.direction])
    if (clusterReq[this.direction] || this._request[this.floor]) {
      return true
    } else if (clusterReq[this.getOppositeDirection()] && !this._isRequestOnDirection()) {
      this.direction = this.getOppositeDirection()
      return true
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
  _setDirection () {
    if (this.direction !== null) return
    if (this._isRequestAbove()) {
      this.direction = 'up'
    } else if (this._isRequestBelow()) {
      this.direction = 'down'
    }
  }
  getOppositeDirection () {
    if (this.direction === 'up') return 'down'
    if (this.direction === 'down') return 'up'
    return null
  }
}
