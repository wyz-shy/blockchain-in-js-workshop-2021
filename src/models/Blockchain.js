class Blockchain {
  // 1. 完成构造函数及其参数
  /* 构造函数需要包含 
      - 名字
      - 创世区块
      - 存储区块的映射
  */
        constructor(name) {
          this.name = name
          this.genesis = null
          this.blocks = {}
        }
      
        longestChain() {
          let longestChain = [this.genesis]
          let currentBlock = this.blocks[this.genesis.hash]
      
          while (currentBlock) {
            let chain = [currentBlock]
            let prevBlock = this.blocks[currentBlock.prevHash]
      
            while (prevBlock) {
              chain.unshift(prevBlock)
              prevBlock = this.blocks[prevBlock.prevHash]
            }
      
            if (chain.length > longestChain.length) {
              longestChain = chain
            }
      
            currentBlock = this.getNextBlock(currentBlock)
          }
      
          return longestChain
        }
      
        getNextBlock(block) {
          let nextBlock = null
      
          for (let hash in this.blocks) {
            let currentBlock = this.blocks[hash]
      
            if (currentBlock.prevHash == block.hash) {
              if (!nextBlock || currentBlock.timestamp > nextBlock.timestamp) {
                nextBlock = currentBlock
              }
            }
          }
      
          return nextBlock
        }
  }



  // 2. 定义 longestChain 函数
  /* 
    返回当前链中最长的区块信息列表
  */


export default Blockchain
