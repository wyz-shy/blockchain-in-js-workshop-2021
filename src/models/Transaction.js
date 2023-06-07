import { v4 as uuidv4 } from 'uuid'

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.id = uuidv4().replace(/-/g, '')
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
    this.timestamp = new Date().getTime()
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString()
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets')
    }
    const hashTx = this.calculateHash()
    const sig = signingKey.sign(hashTx, 'base64')
    this.signature = sig.toDER('hex')
  }

  isValid() {
    if (this.fromAddress === null) {
      return true
    }
    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction')
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.calculateHash(), this.signature)
  }
}

export default Transaction