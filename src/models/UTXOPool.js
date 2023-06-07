import { ec } from 'elliptic'
import sha256 from 'crypto-js/sha256.js'

class UTXOPool {
  constructor() {
    this.utxos = {}
  }

  update(transaction) {
    const inputUTXOs = transaction.inputUTXOs()
    inputUTXOs.forEach((utxo) => {
      delete this.utxos[utxo.id]
    })
    const outputUTXOs = transaction.outputUTXOs()
    outputUTXOs.forEach((utxo) => {
      this.utxos[utxo.id] = utxo
    })
  }

  isValidTransaction(senderPublicKey, amount) {
    let balance = 0
    for (let id in this.utxos) {
      const utxo = this.utxos[id]
      if (utxo.senderPublicKey === senderPublicKey) {
        balance += utxo.amount
      }
    }
    return balance >= amount
  }
}

export default UTXOPool 