import { ec } from 'elliptic'
import sha256 from 'crypto-js/sha256.js'

class UTXO {
  constructor(senderPublicKey, amount) {
    this.senderPublicKey = senderPublicKey
    this.amount = amount
    this.id = sha256(senderPublicKey + amount + Math.random()).toString()
  }

  equals(utxo) {
    return this.id === utxo.id
  }
}

export default UTXO