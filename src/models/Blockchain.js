import { unfold, values } from "ramda";
import Block from "./Block.js";
// Blockchain
class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含 
      - 名字
      - 创世区块
      - 存储区块的映射
  */
 
      constructor(name) {
        this.name = name
        this.blocks = {}
        this.difficulty = 2
        this.genesis = null
      }
    
    

    
    
    
    
  // 2. 定义 longestChain 函数
  /* 
    返回当前链中最长的区块信息列表
  */
    longestChain() {
      let longestChain = [this.genesis]
  
      for (let hash in this.blocks) {
        let block = this.blocks[hash]
        let chain = [block]
  
        while (chain[0].previousHash !== this.genesis.hash) {
          chain.unshift(this.blocks[chain[0].previousHash])
        }
  
        if (chain.length > longestChain.length) {
          longestChain = chain
        }
      }
  
      return longestChain
    }
}
  
       
  

export default Blockchain
