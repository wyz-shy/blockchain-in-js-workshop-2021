import sha256 from 'crypto-js/sha256.js'

class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender
    this.receiver = receiver
    this.amount = amount
    this.timestamp = new Date().getTime()
    this.hash = this._calculateHash()
  }

  _calculateHash() {
    return sha256(
      `${this.sender}${this.receiver}${this.amount}${this.timestamp}`,
    ).toString()
  }
}

export default Transaction