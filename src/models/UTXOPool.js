import UTXO from './UTXO.js'

class UTXOPool {
  constructor() {
    this.utxos = {}
  }

  addUTXO(utxo) {
    this.utxos[utxo.pubKey] = utxo
  }

  removeUTXO(pubKey) {
    delete this.utxos[pubKey]
  }

  isValidTransaction(pubKey, amount) {
    if (!this.utxos[pubKey] || this.utxos[pubKey].amount < amount) {
      return false
    }
    return true
  }

  handleTransaction(trx) {
    if (this.isValidTransaction(trx.sender, trx.amount)) {
      const senderUTXO = this.utxos[trx.sender]
      const receiverUTXO = this.utxos[trx.receiver]
      const newSenderUTXOAmount = senderUTXO.amount - trx.amount
      const newReceiverUTXOAmount = receiverUTXO
        ? receiverUTXO.amount + trx.amount
        : trx.amount
      if (newSenderUTXOAmount > 0) {
        this.utxos[trx.sender] = new UTXO(trx.sender, newSenderUTXOAmount)
      } else {
        this.removeUTXO(trx.sender)
      }
      this.utxos[trx.receiver] = new UTXO(trx.receiver, newReceiverUTXOAmount)
    }
  }
}

export default UTXOPool