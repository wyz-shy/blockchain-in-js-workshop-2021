import sha256 from 'crypto-js/sha256.js'
class Block {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含

  */
    constructor(blockchain, previousHash, height, hash) {
      this.blockchain = blockchain
      this.previousHash = previousHash
      this.height = height
      this.hash = hash
    }
    
  }

  

export default Block
