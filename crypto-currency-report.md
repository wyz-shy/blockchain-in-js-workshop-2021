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
