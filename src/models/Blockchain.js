import Block, { DIFFICULTY } from './Block.js'

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = DIFFICULTY
    this.pendingTransactions = []
    this.miningReward = 50
  }

  createGenesisBlock() {
    return new Block(this, '0', 0, '', '')
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1]
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(this, this.getLatestBlock().hash, this.getLatestBlock().height + 1, '', miningRewardAddress)
    block.transactions = [...this.pendingTransactions]
    block.merkleRoot = block.calculateMerkleRoot()
    block.mineBlock()

    this.chain.push(block)

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address')
    }
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain')
    }
    if (transaction.amount <= 0) {
      throw new Error('Transaction amount must be greater than 0')
    }
    if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
      throw new Error('Not enough balance')
    }
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address) {
    let balance = 0
    for (let block of this.chain) {
      for (let transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount
        }
      }
    }
    return balance
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (!currentBlock.hasValidTransactions()) {
        return false
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      if (currentBlock.previousBlockHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

export default Blockchain
