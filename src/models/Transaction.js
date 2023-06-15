import sha256 from 'crypto-js/sha256.js'
import UTXOPool from './UTXOPool.js'

export default class Transaction {
  constructor(sender, receiver, amount, fee) {
    this.sender = sender
    this.receiver = receiver
    this.amount = amount
    this.fee = fee
    this.timestamp = new Date().getTime()
    this.inputs = []
    this.outputs = []
    this.hash = this._calculateHash()
  }

  _calculateHash() {
    return sha256(
      this.sender +
        this.receiver +
        this.amount +
        this.fee +
        this.timestamp +
        JSON.stringify(this.inputs) +
        JSON.stringify(this.outputs),
    ).toString()
  }

  addInput(utxo) {
    this.inputs.push(utxo)
  }

  addOutput(receiver, amount) {
    this.outputs.push({ receiver, amount })
  }

  _isValidInput(utxo, utxoPool) {
    if (!utxoPool.containsUTXO(utxo)) {
      return false
    }
    const output = utxoPool.getUTXO(utxo)
    if (output.amount < this.amount) {
      return false
    }
    return true
  }

  isValid(utxoPool) {
    if (!this.inputs.length || !this.outputs.length) {
      return false
    }
    const inputSum = this.inputs.reduce((acc, utxo) => {
      if (!this._isValidInput(utxo, utxoPool)) {
        return Number.MIN_SAFE_INTEGER
      }
      const output = utxoPool.getUTXO(utxo)
      return acc + output.amount
    }, 0)
    const outputSum = this.outputs.reduce((acc, { amount }) => acc + amount, 0)
    return inputSum >= outputSum + this.fee
  }
}