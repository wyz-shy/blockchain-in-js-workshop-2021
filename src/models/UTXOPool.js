import UTXO from './UTXO.js'

class UTXOPool {
  constructor() {
    this.utxos = {} // 存储所有UTXO的键值对
  }

  // 添加UTXO到池中
  addUTXO(hash, index, amount, address) {
    this.utxos[hash + ':' + index] = new UTXO(hash, index, amount, address)
  }

  // 移除UTXO从池中
  removeUTXO(hash, index) {
    delete this.utxos[hash + ':' + index]
  }

  // 获取指定哈希值和索引的UTXO
  getUTXO(hash, index) {
    return this.utxos[hash + ':' + index]
  }
}

export default UTXOPool
