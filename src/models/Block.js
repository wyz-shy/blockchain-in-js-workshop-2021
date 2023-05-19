import sha256 from 'crypto-js/sha256.js'
const CryptoJS = require('crypto-js');
class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含

  */
    constructor(blockchain, prevHash, height, data) {
      this.blockchain = blockchain
      this.prevHash = prevHash
      this.height = height
      this.data = data
      this.timestamp = new Date().getTime()
      this.hash = this.calculateHash()
    }
  
    calculateHash() {
      return sha256(
        this.prevHash + this.height.toString() + this.data + this.timestamp.toString(),
      ).toString()
    }
  
    isValid() {
      return this.hash === this.calculateHash() && this.prevHash === this.blockchain.getLastBlock().hash
    }
}


export default Block
