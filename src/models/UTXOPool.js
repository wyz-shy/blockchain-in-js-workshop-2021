import UTXO from './UTXO.js'

class UTXOPool {
  constructor() {
    this.utxoMap = new Map()
  }

  addUTXO(utxo) {
    this.utxoMap.set(utxo.transactionOutputId, utxo)
  }

  removeUTXO(utxo) {
    this.utxoMap.delete(utxo.transactionOutputId)
  }

  getUTXO(utxoId) {
    return this.utxoMap.get(utxoId)
  }

  getAllUTXOs() {
    return Array.from(this.utxoMap.values())
  }

  getUTXOsByAddress(address) {
    const utxos = []
    for (let utxo of this.getAllUTXOs()) {
      if (utxo.transactionOutput.toAddress === address) {
        utxos.push(utxo)
      }
    }
    return utxos
  }

  updateUTXO(utxo) {
    this.utxoMap.set(utxo.transactionOutputId, utxo)
  }
}

export default UTXOPool






