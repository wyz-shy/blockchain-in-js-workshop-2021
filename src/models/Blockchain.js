import Block, { DIFFICULTY } from './Block.js'

class Blockchain {
  constructor(name) {
    this.name = name
    this.chain = []
    this.genesis = null
    this.isInterrupted = false
  }

  _addBlock(block) {
    this.chain.push(block)
  }

  addBlock(data, coinbaseBeneficiary) {
    const newBlock = new Block(
      this,
      this.chain[this.chain.length - 1].hash,
      this.chain.length,
      data,
      coinbaseBeneficiary,
    )
    newBlock.mine()
    this._addBlock(newBlock)
  }

  interrupt() {
    this.isInterrupted = true
  }

  longestChain() {
    if (this.chain.length === 0) {
      return []
    }
    let longestChain = [this.chain[0]]
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i]
      if (
        block.previousHash === longestChain[longestChain.length - 1].hash &&
        block.isValid()
      ) {
        longestChain.push(block)
      } else {
        break
      }
    }
    return longestChain
  }

  containsBlock(block) {
    for (let i = 0; i < this.chain.length; i++) {
      if (this.chain[i].hash === block.hash) {
        return true
      }
    }
    return false
  }
}

export default Blockchain