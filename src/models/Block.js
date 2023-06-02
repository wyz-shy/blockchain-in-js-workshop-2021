import sha256 from 'crypto-js/sha256.js'
import { DIFFICULTY } from './Block.js'
import { validateHash } from '../utils.js'

class Block {
  constructor(blockchain, prevHash, height, data, coinbaseBeneficiary) {
    this.blockchain = blockchain
    this.prevHash = prevHash
    this.height = height
    this.timestamp = new Date().getTime()
    this.data = data
    this.nonce = 0
    this.hash = sha256(
      `${this.prevHash}${this.height}${this.timestamp}${this.data}${this.nonce}`,
    ).toString()
    this.difficulty = DIFFICULTY
    this.coinbaseBeneficiary = coinbaseBeneficiary
    this.transactions = []
    this.utxoPool = new UTXOPool()
  }

  addTransaction(trx) {
    this.transactions.push(trx)
  }

  isValid() {
    const prefix = '0'.repeat(this.difficulty)
    return validateHash(this.hash) && this.hash.startsWith(prefix)
  }
}

export const DIFFICULTY = 3

export default Block