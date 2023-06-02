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