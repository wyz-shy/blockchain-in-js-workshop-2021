# 数字货币技术理论课实验报告

## 小组成员

- 2021131162-姓名 王予臻（组长）
- 2021131161-姓名 赵天宇
- 2021131157-姓名 何政伟
- 2021131147-姓名 雷明雨
- 2021131158-姓名 陈诺
- 2021131160-姓名 易孟

## 代码仓库链接

https://github.com/caosbad/blockchain-in-js-workshop-2021(示例用，请根据自身的仓库替换)



## 第一课代码


### 代码 commint 地址

https://github.com/CUITBlockchain/blockchain-in-js-workshop-2021/commit/25f3a0d83a9fff2b4514c5503f470df939d0c2af


### 代码截图

> 将截图上传至网盘，放入链接即可

![](链接)


### 主观与讨论题内容

---



## 第二课代码


### 代码 commint 地址

https://github.com/CUITBlockchain/blockchain-in-js-workshop-2021/commit/25f3a0d83a9fff2b4514c5503f470df939d0c2af


### 代码截图

> 将截图上传至网盘，放入链接即可

![](链接)


### 主观与讨论题内容

---


## 第三课代码


### 代码 commint 地址

https://github.com/CUITBlockchain/blockchain-in-js-workshop-2021/commit/25f3a0d83a9fff2b4514c5503f470df939d0c2af


### 代码截图

> 将截图上传至网盘，放入链接即可

![](链接)


### 主观与讨论题内容



---


//默克尔树
const CryptoJS = require('crypto-js');

class MerkleTree {
  constructor(elements) {
    this.elements = elements;
    this.levels = this.buildLevels(elements);
    this.root = this.levels[this.levels.length - 1][0];
  }

  buildLevels(elements) {
    if (elements.length === 0) {
      throw new Error('No elements provided.');
    }

    const levels = [];
    levels.push(elements.map((el) => this.hash(el)));

    while (levels[levels.length - 1].length > 1) {
      const prevLevel = levels[levels.length - 1];
      const currLevel = [];

      for (let i = 0; i < prevLevel.length; i += 2) {
        const left = prevLevel[i];
        const right = i + 1 < prevLevel.length ? prevLevel[i + 1] : left;
        const hash = this.combineHashes(left, right);
        currLevel.push(hash);
      }

      levels.push(currLevel);
    }

    return levels;
  }

  hash(data) {
    return CryptoJS.SHA256(data.toString()).toString();
  }

  combineHashes(left, right) {
    return this.hash(left + right);
  }

  getElementProof(element) {
    const index = this.elements.indexOf(element);
    if (index === -1) {
      throw new Error('Element not found in the Merkle tree.');
    }

    const proof = [];
    let levelIndex = 0;
    let currentIndex = index;

    while (levelIndex < this.levels.length - 1) {
      const level = this.levels[levelIndex];
      const isLeftNode = currentIndex % 2 === 0;
      const siblingIndex = isLeftNode ? currentIndex + 1 : currentIndex - 1;

      if (siblingIndex < level.length) {
        proof.push({
          position: isLeftNode ? 'right' : 'left',
          data: level[siblingIndex],
        });
      }

      currentIndex = Math.floor(currentIndex / 2);
      levelIndex++;
    }

    return proof;
  }

  verifyElementProof(element, proof) {
    const elementHash = this.hash(element);
    let hash = elementHash;

    for (const proofElement of proof) {
      const siblingHash = proofElement.data;
      const isLeftNode = proofElement.position === 'left';
      hash = isLeftNode ? this.combineHashes(siblingHash, hash) : this.combineHashes(hash, siblingHash);
    }

    return hash === this.root;
  }
}

// 示例用法：
const elements = ['element1', 'element2', 'element3', 'element4'];
const merkleTree = new MerkleTree(elements);
console.log('Merkle Root:', merkleTree.root);

const elementToVerify = 'element3';
const proof = merkleTree.getElementProof(elementToVerify);
console.log('Proof:', proof);

const isVerified = merkleTree.verifyElementProof(elementToVerify, proof);
console.log('Is Verified:', isVerified);



//字典树
class TrieNode {
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    constructor() {
      this.root = new TrieNode();
    }
    
    insert(word) {
      let node = this.root;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
    
    search(word) {
      let node = this.root;
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (!node.children[char]) {
          return false;
        }
        node = node.children[char];
      }
      return node.isEndOfWord;
    }
    
    delete(word) {
      const deleteSubtree = (node, i) => {
        if (i === word.length) {
          node.isEndOfWord = false;
          return Object.keys(node.children).length === 0;
        }
        const char = word[i];
        if (!node.children[char]) {
          return false;
        }
        const shouldDelete = deleteSubtree(node.children[char], i + 1);
        if (shouldDelete) {
          delete node.children[char];
          return Object.keys(node.children).length === 0;
        }
        return false;
      };
      deleteSubtree(this.root, 0);
    }
  }
  const trie = new Trie();

// Insert words
trie.insert("apple");
trie.insert("banana");
trie.insert("cat");

// Test search
console.log(trie.search("apple")); // true
console.log(trie.search("banana")); // true
console.log(trie.search("car")); // false

// Test deletion
trie.delete("banana");
console.log(trie.search("banana")); // false
console.log(trie.search("apple")); // true
console.log(trie.search("cat")); // true






//MPT
const keccak256 = require('keccak256')

class MPT {
  constructor() {
    this.db = new Map()
    this.rootValue = null
  }

  // 向 MPT 中添加或更新一个账户
  setAccount(address, balance, data) {
    // 1. 首先将账户地址转换为一个长度为 40 的 16 进制字符串
    const hexAddress = address.toLowerCase().substr(2, 40)

    // 2. 计算 hash 值，获取相应的节点
    let node
    if (this.rootValue === null) {
      node = new LeafNode(hexAddress, balance, data)
      this.rootValue = node.hash()
      this.db.set(this.rootValue, node)
    } else {
      let currentNode = this.db.get(this.rootValue)
      node = this._set(currentNode, hexAddress, balance, data)
      this.rootValue = node.hash()
    }

    return this.rootValue
  }

  // 递归地向 MPT 中添加或更新一个账户
  _set(node, hexAddress, balance, data) {
    switch (node.type) {
      case NodeType.EMPTY:
        return new LeafNode(hexAddress, balance, data)
      case NodeType.LEAF:
        if (node.key === hexAddress) {
          node.balance = balance
          node.data = data
        } else {
          const newNode = new BranchNode(node.key, hexAddress)
          newNode.setChild(node, node.hexKey())
          return this._set(newNode, hexAddress, balance, data)
        }
        break
      case NodeType.EXTENSION:
        if (hexAddress.startsWith(node.key)) {
          const updatedChild = this._set(node.getChild(node.hexKey()), hexAddress, balance, data)
          node.setChild(updatedChild, node.hexKey())
        } else {
          const newNode = new BranchNode(node.key, hexAddress)
          const newChild = new LeafNode(hexAddress, balance, data)
          newNode.setChild(node, node.hexKey())
          newNode.setChild(newChild, hexAddress.substr(node.key.length))
          return newNode
        }
        break
      case NodeType.BRANCH:
        const nibble = hexAddress.substr(node.nibbleIndex, 1)
        const hexKey = node.hexKeyForNibble(nibble)
        const childNode = node.getChild(hexKey)

        let updatedChild
        if (childNode.type === NodeType.EMPTY) {
          updatedChild = new LeafNode(hexAddress, balance, data)
        } else {
          updatedChild = this._set(childNode, hexAddress, balance, data)
        }

        return node.setChild(updatedChild, hexKey)
    }

    return node
  }

  // 根据地址获取指定账户的数据和余额信息
  getAccount(address) {
    const hexAddress = address.toLowerCase().substr(2, 40)
    let currentNode = this.db.get(this.rootValue)

    if (currentNode === undefined) {
      return null
    }

    for (let i = 0; i < hexAddress.length; i += 2) {
      const nibble = parseInt(hexAddress.substr(i, 2), 16)

      switch (currentNode.type) {
        case NodeType.EMPTY:
          return null
        case NodeType.LEAF:
          return (currentNode.key === hexAddress) ? { balance: currentNode.balance, data: currentNode.data } : null
        case NodeType.EXTENSION:
          if (!hexAddress.startsWith(currentNode.key)) {
            return null
          }
          currentNode = currentNode.getChild(currentNode.hexKey())
          break
        case NodeType.BRANCH:
          currentNode = currentNode.getChild(currentNode.hexKeyForNibble(nibble))
      }
    }

    return null
  }

  // 验证 MPT 是否正确
  validate(rootValue) {
    return this.rootValue === rootValue
  }
}

// 节点类型
const NodeType = {
  EMPTY: 0,
  LEAF: 1,
  EXTENSION: 2,
  BRANCH: 3
}

// 节点抽象类
class Node {
  constructor(type) {
    this.type = type
  }

  // 计算节点的 hash 值
  hash() {
    return keccak256(this.toBuffer())
  }

  // 将节点转换为 Buffer 类型
  toBuffer() {}

  // 获取节点的 4 位 (nibble) 键值
  nibble(key, index) {
    const hexKey = key.substr(index, 2)
    const nibbles = []
    for (let i = 0; i < hexKey.length; i++) {
      nibbles.push(parseInt(hexKey[i], 16))
    }
    return nibbles
  }
}

// 叶子节点
class LeafNode extends Node {
  constructor(key, balance, data) {
    super(NodeType.LEAF)
    this.key = key
    this.balance = balance
    this.data = data
  }

  // 将节点转换为 Buffer 类型
  toBuffer() {
    const encodedKey = encodeNibbles(this.nibble(this.key, 0));
    const encodedBalance = Buffer.from(this.balance.toString(16).padStart(64, '0'), 'hex')
    const encodedData = Buffer.from(this.data, 'utf8')
    const buffers = [Buffer.from([0xc0 + (encodedKey.length - 1)]), encodedKey, encodedBalance, encodedData]
    return Buffer.concat(buffers)
  }
}

/**
 * 将 nibbles 编码为紧凑的 nibble 键
 * @param {number[]} nibbles - nibble 数组
 * @returns {Buffer} - 编码后的 nibble 键
 */
function encodeNibbles(nibbles) {
  let flag = 2
  let odd = false
  if (nibbles.length % 2 !== 0) {
    flag += 1
    odd = true
  }

  const bytes = []
  let currentByte = 0
  for (let i = 0; i < nibbles.length; i++) {
    if (odd) {
      currentByte = (nibbles[i] << 4)
      odd = false
    } else {
      currentByte |= nibbles[i]
      bytes.push(currentByte)
      currentByte = 0
      odd = true
    }
  }

  if (odd) {
    currentByte |= 0x0f
    bytes.push(currentByte)
  }

  return Buffer.from(bytes)
}

// 扩展节点
class ExtensionNode extends Node {
  constructor(key, child) {
    super(NodeType.EXTENSION)
    this.key = key
    this.child = child
  }

  // 将节点转换为 Buffer 类型
  toBuffer() {
    const encodedKey = encodeNibbles(this.nibble(this.key, 0))
    const childBuffer = this.child.toBuffer()
    const buffers = [Buffer.from([0xc7 + (encodedKey.length - 1)]), encodedKey, childBuffer]
    return Buffer.concat(buffers)
  }

  // 获取指定 nibble 对应的子节点
  getChild(hexKey) {
    return this.child
  }

  // 设置指定 nibble 对应的子节点
  setChild(node, hexKey) {
    this.child = node
  }

  // 获取指定 nibble 对应的子节点的 4 位 (nibble) 键值
  hexKey() {
    return this.key.substr(2)
  }
}

// 分支节点
class BranchNode extends Node {
  constructor(key, child) {
    super(NodeType.BRANCH)
    this.children = []
    this.nibbleIndex = key.length
    this.setChild(new ExtensionNode(key, child), key)
  }

  // 将节点转换为 Buffer 类型
  toBuffer() {
    const buffers = []
    for (let i = 0; i < 16; i++) {
      const child = this.children[i]
      buffers.push(child.toBuffer())
    }
    return Buffer.concat(buffers)
  }

  // 获取指定 nibble 对应的子节点
  getChild(hexKey) {
    return this.children[parseInt(hexKey, 16)]
  }

  // 设置指定 nibble 对应的子节点
  setChild(node, hexKey) {
    this.children[parseInt(hexKey, 16)] = node
  }

  // 获取指定 nibble 对应的子节点的 4 位 (nibble) 键值
  hexKeyForNibble(nibble) {
    const index = nibble * 2
    return this.toNibbleKey(this.key.substr(index, 2))
  }

  // 转换为 nibble 键
  toNibbleKey(hexKey) {
    const nibbles = this.nibble(hexKey, 0)
    return encodeNibbles(nibbles)
  }
  
}

const mpt = new MPT()
const rootValue = mpt.setAccount('0x1', 100, 'hello world')
console.log(rootValue)

const account = mpt.getAccount('0x1')
console.log(account)

const isValid = mpt.validate(rootValue)
console.log(isValid)