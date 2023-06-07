import sha256 from 'crypto-js/sha256.js'
import hexToBinary from 'hex-to-binary'

const DIFFICULTY = 4
const MAX_NONCE = 5000000

class Block {
  constructor(blockchain, previousHash, height, data, coinbaseBeneficiary) {
    this.blockchain = blockchain
    this.previousHash = previousHash
    this.height = height
    this.timestamp = new Date().getTime()
    this.data = data
    this.coinbaseBeneficiary = coinbaseBeneficiary
    this.nonce = 0
    this.hash = this._calculateHash()
    this.transactions = []
    this.utxoPool = new UTXOPool()
  }

  _calculateHash() {
    return sha256(
      this.previousHash +
        this.height +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce,
    ).toString()
  }

  isValid() {
    const prefix = '0'.repeat(DIFFICULTY)
    return this.hash.startsWith(prefix)
  }

  addTransaction(transaction) {
    if (!transaction.isValid()) {
      throw new Error('Error: invalid transaction')
    }
    this.transactions.push(transaction)
    this.utxoPool.update(transaction)
  }

  combinedTransactionsHash() {
    let transactions = ''
    for (let i = 0; i < this.transactions.length; i++) {
      transactions += this.transactions[i].hash
    }
    return sha256(transactions).toString()
  }

  mine() {
    while (
      this.nonce < MAX_NONCE &&
      !this.isValid() &&
      !this.blockchain.isInterrupted
    ) {
      this.nonce++
      this.hash = this._calculateHash()
    }
    if (this.isValid()) {
      console.log(`Block mined: ${this.hash}`)
    }
  }
}

export { DIFFICULTY }
export default Block