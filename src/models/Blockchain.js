import Block from './Block.js'
import UTXOPool from './UTXOPool.js'

export default class Blockchain {
  constructor(name) {
    this.name = name
    this.blocks = []
    this.genesis = null
  }

  _addBlock(block) {
    if (!(block instanceof Block)) {
      throw new Error('Invalid block')
    }
    if (this.genesis == null && block.height === 0) {
      this.genesis = block
    } else if (block.prevHash === this.blocks[this.blocks.length - 1].hash) {
      this.blocks.push(block)
    } else {
      throw new Error('Invalid block')
    }
  }

  containsBlock(block) {
    return this.blocks.some((b) => b.hash === block.hash)
  }

  longestChain() {
    let longest = [this.genesis]
    let curr = this.blocks.find((b) => b.prevHash === longest[0].hash)
    while (curr) {
      longest.push(curr)
      curr = this.blocks.find((b) => b.prevHash === curr.hash)
    }
    return longest
  }
}