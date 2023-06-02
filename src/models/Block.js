import sha256 from 'crypto-js/sha256.js'

const DIFFICULTY = 5 // 区块挖矿的难度，数字越大越难

class Block {
  constructor(blockchain, prevHash, height, body, coinbaseBeneficiary) {
    this.blockchain = blockchain // 区块链对象
    this.prevHash = prevHash // 前一个区块的哈希值
    this.height = height // 区块高度
    this.timestamp = new Date().getTime() // 区块创建时间
    this.body = body // 区块体，即交易信息
    this.coinbaseBeneficiary = coinbaseBeneficiary // 区块奖励接收者
    this.nonce = 0 // 工作量证明的随机数
    this.hash = this.calculateHash() // 当前区块的哈希值
    this.difficulty = DIFFICULTY // 当前区块的挖矿难度
    this.utxoPool = new UTXOPool() // 当前区块的UTXO池
  }

  // 计算当前区块的哈希值
  calculateHash() {
    const { prevHash, height, timestamp, body, coinbaseBeneficiary, nonce } =
      this
    return sha256(
      prevHash + height + timestamp + body + coinbaseBeneficiary + nonce,
    ).toString()
  }

  // 验证当前区块的哈希值是否满足挖矿难度
  isHashValid(hash) {
    const prefix = '0'.repeat(this.difficulty)
    return hash.startsWith(prefix)
  }

  // 挖矿，计算符合条件的工作量证明
  mineBlock() {
    while (true) {
      this.nonce++
      const hash = this.calculateHash()
      if (this.isHashValid(hash)) {
        this.hash = hash
        console.log(`Block mined: ${this.hash}`)
        return
      }
    }
  }

  // 添加交易到当前区块中
  addTransaction(tx) {
    for (const input of tx.inputs) {
      // 检查输入是否在UTXO池中
      const utxo = this.utxoPool.getUTXO(input.hash, input.index)
      if (!utxo) {
        throw new Error(`Invalid transaction: UTXO not found for input`)
      }
      // 检查输入是否已经被使用
      if (this.blockchain.isInputUsed(input)) {
        throw new Error(`Invalid transaction: input already used`)
      }
    }
    // 检查交易是否合法
    if (!tx.isValid()) {
      throw new Error(`Invalid transaction: ${tx.hash}`)
    }
    // 更新UTXO池
    for (const input of tx.inputs) {
      this.utxoPool.removeUTXO(input.hash, input.index)
    }
    for (let i = 0; i < tx.outputs.length; i++) {
      const output = tx.outputs[i]
      this.utxoPool.addUTXO(tx.hash, i, output.amount, output.address)
    }
    console.log(`Transaction added to block: ${tx.hash}`)
  }

  // 验证当前区块
  isValid() {
    if (this.hash !== this.calculateHash()) {
      return false
    }
    if (!this.isHashValid(this.hash)) {
      return false
    }
    // 检查区块中的每一笔交易是否合法
    for (const tx of this.body) {
      if (!tx.isValid()) {
        return false
      }
    }
    return true
  }
}

export { DIFFICULTY }
export default Block
