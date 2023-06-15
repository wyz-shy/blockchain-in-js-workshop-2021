import UTXO from './UTXO.js'

export default class UTXOPool {
  constructor() {
    this.utxos = {}
  }

  containsUTXO(utxo) {
    const key = `${utxo.txHash}:${utxo.outputIndex}`
    return key in this.utxos
  }

  getUTXO(utxo) {
    const key = `${utxo.txHash}:${utxo.outputIndex}`
    return this.utxos[key]
  }

  addUTXO(utxo) {
    const key = `${utxo.txHash}:${utxo.outputIndex}`
    this.utxos[key] = utxo
  }

  removeUTXO(utxo) {
    const key = `${utxo.txHash}:${utxo.outputIndex}`
    delete this.utxos[key]
  }

  addTransactionOutputs(transaction) {
    for (let i = 0; i < transaction.outputs.length; i++) {
      const { receiver, amount } = transaction.outputs[i]
      const utxo = new UTXO(transaction.hash, i, amount)
      this.addUTXO(utxo)
    }
  }

  removeTransactionOutputs(transaction) {
    for (let i = 0; i < transaction.inputs.length; i++) {
      const utxo = transaction.inputs[i]
      this.removeUTXO(utxo)
    }
  }

  isValidTransaction(transaction) {
    const inputSum = transaction.inputs.reduce((acc, utxo) => {
      if (!this.containsUTXO(utxo)) {
        return Number.MIN_SAFE_INTEGER
      }
      const output = this.getUTXO(utxo)
      return acc + output.amount
    }, 0)
    const outputSum = transaction.outputs.reduce(
      (acc, { amount }) => acc + amount,
      0,
    )
    return inputSum >= outputSum
  }
}