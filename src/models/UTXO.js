export default class UTXO {
  constructor(txHash, outputIndex, amount) {
    this.txHash = txHash
    this.outputIndex = outputIndex
    this.amount = amount
  }

  equals(utxo) {
    return (
      this.txHash === utxo.txHash &&
      this.outputIndex === utxo.outputIndex &&
      this.amount === utxo.amount
    )
  }
}