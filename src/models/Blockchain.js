import UTXOPool from './UTXOPool.js'

class Blockchain {
  // 实现构造函数及其参数
  constructor(name, genesis) {
    this.name = name
    this.genesis = genesis
    this.blocks = {}
    this.utxoPool = new UTXOPool()
  }

  // 实现longestChain方法
  longestChain() {
    let currentBlock = this.maxHeightBlock()
    const longestChain = [currentBlock]
    while (currentBlock.previousHash) {
      currentBlock = this.blocks[currentBlock.previousHash]
      longestChain.unshift(currentBlock)
    }
    return longestChain
  }

  // 实现containsBlock方法
  containsBlock(block) {
    return Boolean(this.blocks[block.hash])
  }

  // 实现maxHeightBlock方法
  maxHeightBlock() {
    let maxHeightBlock = this.genesis
    for (const hash in this.blocks) {
      const block = this.blocks[hash]
      if (block.height > maxHeightBlock.height) {
        maxHeightBlock = block
      }
    }
    return maxHeightBlock
  }

  // 实现_addBlock内部方法
  _addBlock(block) {
    if (!block.isValid()) {
        return
    }
    if (this.containsBlock(block)) {
        return
    }

    const txs = block.transactions
    // 添加 UTXO 快照与更新的相关逻辑
    const snapshot = this.utxoPool.clone()

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i]
      const txHash = tx.computeHash()
      // 验证当前交易是否是矿工的奖励交易
      const isCoinbase = tx.inputs.length === 0
      // 记录输入与输出
      const consumedUTXOs = []
      for (let j = 0; j < tx.inputs.length; j++) {
        const input = tx.inputs[j]
        const utxo = snapshot.getTxOutput(input.prevTxHash, input.outputIndex)
        if (!utxo) {
          throw new Error('Unable to find UTXO')
        }
        if (isCoinbase) {
          // 矿工奖励交易
          consumedUTXOs.push(utxo)
        } else {
          // 普通交易
          if (this.utxoPool.contains(utxo)) {
            this.utxoPool.removeUTXO(utxo)
            consumedUTXOs.push(utxo)
          } else {
            throw new Error('Invalid UTXO')
          }
        }
      }

      const createdUTXOs = []
      for (let j = 0; j < tx.outputs.length; j++) {
        const output = tx.outputs[j]
        const utxo = new UTXO(txHash, j)
        createdUTXOs.push(utxo)
        this.utxoPool.addUTXO(utxo, output)
      }
    }

    // 添加新的区块
    this.blocks[block.hash] = block
  }
}

export default Blockchain