class UTXO {
  constructor(hash, index, amount, address) {
    this.hash = hash // 交易哈希值
    this.index = index // 交易输出索引
    this.amount = amount // 未花费输出的金额
    this.address = address // 未花费输出的所有者地址
  }
}

export default UTXO
