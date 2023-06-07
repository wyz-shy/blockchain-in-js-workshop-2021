import sha256 from 'crypto-js/sha256.js'
import Transaction from './Transaction.js'

export const DIFFICULTY = 4

class Block {
  constructor(blockchain, previousBlockHash, height, merkleRoot, coinbaseBeneficiary) {
    this.blockchain = blockchain
    this.previousBlockHash = previousBlockHash
    this.height = height
    this.timestamp = new Date().getTime()
    this.transactions = []
    this.merkleRoot = merkleRoot
    this.coinbaseBeneficiary = coinbaseBeneficiary
    this.nonce = 0
    this.hash = ''
  }

  addTransaction(transaction) {
    this.transactions.push(transaction)
  }

  mineBlock() {
    while (this.hash.substring(0, DIFFICULTY) !== Array(DIFFICULTY + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log('Block mined: ' + this.hash)
  }

  calculateHash() {
    return sha256(this.previousBlockHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()
  }

  hasValidTransactions() {
    for (let transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false
      }
    }
    return true
  }
}

export default Block