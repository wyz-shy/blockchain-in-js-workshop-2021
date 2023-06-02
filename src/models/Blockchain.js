import Block, { DIFFICULTY } from './Block.js'
import UTXOPool from './UTXOPool.js'

class Blockchain {
  constructor(name) {
    this.name = name // 区块链的名称
    this.chain = [] // 所有区块的列表
    this.genesis = null // 创世区块
    this.utxoPool = new UTXOPool() // 区块链的UTXO池
  }

  // 创建创世区块
  createGenesisBlock() {
    const genesisBlock = new Block(
      this,
      null,
      0,
      'Genesis Block',
      'coinbaseAddress',
    )
    genesisBlock.utxoPool = this.utxoPool
    genesisBlock.mineBlock()
    this.genesis = genesisBlock
    this.chain.push(genesisBlock)
  }

  // 向区块链中添加新的区块
  addBlock(block) {
    if (block.prevHash !== this.chain[this.chain.length - 1].hash) {
      throw new Error(`Invalid block: incorrect prevHash`)
    }
    if (!block.isValid()) {
      throw new Error(`Invalid block: ${block.hash}`)
    }
    // 更新UTXO池
    for (const tx of block.body) {
      for (const input of tx.inputs) {
        this.utxoPool.removeUTXO(input.hash, input.index)
      }
      for (let i = 0; i < tx.outputs.length; i++) {
        const output = tx.outputs[i]
        this.utxoPool.addUTXO(tx.hash, i, output.amount, output.address)
      }
    }
    this.chain.push(block)
    console.log(`Block added to ${this.name}: ${block.hash}`)
  }

  // 查找区块链中高度最大的链
  longestChain() {
    let longest = []
    for (let i = 0; i < this.chain.length; i++) {
      let chain = [this.chain[i]]
      let block = this.chain[i]
      while (block.prevHash !== null) {
        block = this.getBlockByHash(block.prevHash)
        chain.push(block)
      }
      if (chain.length > longest.length) {
        longest = chain
      }
    }
    return longest
  }

  // 获取指定哈希值的区块
  getBlockByHash(hash) {
    for (const block of this.chain) {
      if (block.hash === hash) {
        return block
      }
    }
    return null
  }

  // 获取指定高度的区块
  getBlockByHeight(height) {
    for (const block of this.chain) {
      if (block.height === height) {
        return block
      }
    }
    return null
  }

  // 判断区块链中是否已经使用过某个交易输入
  isInputUsed(input) {
    for (const block of this.chain) {
      for (const tx of block.body) {
        for (const inpt of tx.inputs) {
          if (inpt.hash === input.hash && inpt.index === input.index) {
            return true
          }
        }
      }
    }
    return false
  }
}

export default Blockchain
