import sha256 from 'crypto-js/sha256.js'
import hexToBinary from 'hex-to-binary'
import { UTXO, UTXOPool } from './UTXO.js'

class Transaction {
  constructor(senderPublicKey, recipientPublicKey, amount) {
    this.senderPublicKey = senderPublicKey
    this.recipientPublicKey = recipientPublicKey
    this.amount = amount
    this.timestamp = new Date().getTime()
    this.hash = this._calculateHash()
    this.signature = null
  }

  _calculateHash() {
    return sha256(
      this.senderPublicKey +
        this.recipientPublicKey +
        this.amount +
        this.timestamp,
    ).toString()
  }

  sign(privateKey) {
    const signingKey = ec.keyFromPrivate(privateKey, 'hex')
    const hash = this._calculateHash()
    const signature = signingKey.sign(hash, 'base64')
    this.signature = signature.toDER('hex')
  }

  isValid() {
    if (this.senderPublicKey === this.recipientPublicKey) {
      return false
    }
    if (this.amount <= 0) {
      return false
    }
    if (!this.signature) {
      return false
    }
    const verifyingKey = ec.keyFromPublic(this.senderPublicKey, 'hex')
    const hash = this._calculateHash()
    return verifyingKey.verify(hash, this.signature)
  }
}

export default Transaction