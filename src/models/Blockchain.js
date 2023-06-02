
import Block from './Block.js'

class Blockchain {
  constructor(name) {
    this.name = name
    this.chain = []
    this.genesis = null
  }

  _addBlock(block) {
    this.chain.push(block)
  }

  containsBlock(block) {
    return this.chain.includes(block)
  }

  longestChain() {
    let longestChain = [this.genesis]
    for (let block of this.chain) {
      if (block.prevHash == longestChain[longestChain.length - 1].hash) {
        longestChain.push(block)
      }
    }
    return longestChain
  }
}

export default Blockchain