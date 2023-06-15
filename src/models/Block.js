import sha256 from 'crypto-js/sha256.js'
import Transaction from './Transaction.js'

const DIFFICULTY = 4

export { DIFFICULTY }

export default class Block {
  constructor(blockchain, prevHash, height, merkleRoot, miner) {
    this.blockchain = blockchain
    this.prevHash = prevHash
    this.height = height
    this.merkleRoot = merkleRoot
    this.timestamp = new Date().getTime()
    this.nonce = 0
    this.transactions = []
    this.coinbaseBeneficiary = miner
    this.hash = this._calculateHash()
  }

  _calculateHash() {
    return sha256(
      this.prevHash +
        this.height +
        this.merkleRoot +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.transactions),
    ).toString()
  }

  addTransaction(transaction) {
    if (!(transaction instanceof Transaction)) {
      throw new Error('Invalid transaction')
    }
    if (!transaction.isValid()) {
      throw new Error('Invalid transaction')
    }
    this.transactions.push(transaction)
    this.merkleRoot = this._calculateMerkleRoot()
    this.hash = this._calculateHash()
  }

  _calculateMerkleRoot() {
    const txHashes = this.transactions.map((tx) => tx.hash)
    let level = txHashes
    while (level.length > 1) {
      level = level.reduce((acc, val, i) => {
        if (i % 2 == 0) {
          acc.push(val)
        } else {
          acc[acc.length - 1] = sha256(val + acc[acc.length - 1]).toString()
        }
        return acc
      }, [])
    }
    return level[0]
  }

  isValid() {
    return (
      this.hash.substring(0, DIFFICULTY) === Array(DIFFICULTY + 1).join('0')
    )
  }

  mine() {
    while (!this.isValid()) {
      this.nonce++
      this.hash = this._calculateHash()
    }
  }
}