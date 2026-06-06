class NodeIdFactory {
  private currentId = 1

  reset(start = 1) {
    this.currentId = start
  }

  next() {
    return String(this.currentId++)
  }

  getCurrent() {
    return this.currentId
  }

  setCurrent(val: number) {
    this.currentId = val
  }
}

const nodeIdFactory = new NodeIdFactory()

export default nodeIdFactory
