import sha256 from 'crypto-js/sha256.js'

export const DIFFICULTY = 2

class Block {
  // 实现构造函数及其参数

  constructor(blockchain, previousHash, height, nonce) {
    this.timestamp = new Date().getTime()
    this.transactions = []
    this.previousHash = previousHash
    this.height = height
    this.blockchain = blockchain
    this.nonce = nonce
    this.hash = this.computeHash()
  }

  // 实现isValid方法
  isValid() {
    const targetDifficulty = '0'.repeat(DIFFICULTY)
    return (
      this.hash.substring(0, DIFFICULTY) === targetDifficulty &&
      this.hash === this.computeHash()
    )
  }

  // 计算块的哈希
  computeHash() {
    return sha256(
      this.previousHash +
        this.timestamp.toString() +
        this.transactions.toString() +
        this.nonce.toString(),
    ).toString()
  }

  // 实现setNonce方法
  setNonce(nonce) {
    this.nonce = nonce
    this.hash = this.computeHash()
  }
}

export default Block