const CryptoJS = require('crypto-js');
const hashFunction = (value) => {
    return CryptoJS.SHA256(value.toString()).toString();
};

class Node {
    constructor(value) {
        this.value = value;
        this.hash = hashFunction(value);
    }
}

class MerkleTree {
    constructor(data) {
        this.leaves = data.map((value) => new Node(value));
        this.root = this.buildTree(this.leaves);
    }

    buildTree(nodes) {
        if (nodes.length === 1) {
            return nodes[0];
        }
        const parents = [];
        if (nodes.length % 2 !== 0) {
            nodes.push(nodes[nodes.length - 1]);
        }
        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i];
            const right = nodes[i + 1];
            const parent = new Node(left.hash + right.hash);
            parent.left = left;
            parent.right = right;
            left.parent = parent;
            right.parent = parent;
            parents.push(parent);
        }
        const root = this.buildTree(parents);
        return root;
    }

    addNode(value) {
        const node = new Node(value);
        const lastNode = this.leaves[this.leaves.length - 1];
        const parent = new Node(lastNode.hash + node.hash);
        parent.left = lastNode;
        parent.right = node;
        lastNode.parent = parent;
        node.parent = parent;
        const rootHeight = this.getHeight(this.root);
        const parentHeight = this.getHeight(parent);
        if (parentHeight <= rootHeight) {
            this.leaves.splice(this.leaves.length - 1, 1, node);
            this.root = this.buildTree(this.leaves);
        } else {
            this.leaves.push(parent);
            this.root = this.buildTree(this.leaves);
        }
    }

    deleteNode(value) {
      const node = this.leaves.find((leaf) => leaf.value === value);
      if (!node) {
          return false;
      }
  
      const parent = node.parent;
      if (!parent) {
          // node is root
          this.leaves = [];
          this.root = null;
          return;
      }
  
      const nodeIndex = this.leaves.indexOf(node);
      const sibling = parent.left === node ? parent.right : parent.left;
      if (nodeIndex < this.leaves.indexOf(sibling)) {
          this.leaves.splice(nodeIndex, 1);
          this.leaves.splice(this.leaves.indexOf(sibling), 1);
      } else {
          this.leaves.splice(this.leaves.indexOf(sibling), 1);
          this.leaves.splice(nodeIndex, 1);
      }
      if (this.leaves.length === 1) {
          this.root = this.leaves[0];
      } else {
          this.root = this.buildTree(this.leaves);
      }
      this.updateParents(parent);
      return true;
  }

    updateParents(parent) {
        if (!parent) {
            return;
        }
        const left = parent.left;
        const right = parent.right;
        parent.hash = hashFunction(left.hash + right.hash);
        this.updateParents(parent.parent);
    }

    verify(value) {
      const node = this.findNode(value);
      if (!node) {
          return false;
      }
  
      let current = node;
      let sibling;
      let hash = node.hash;
  
      while (true) {
          const parent = current.parent;
          if (!parent) {
              break;
          }
          if (parent.left === current) {
              sibling = parent.right;
          } else {
              sibling = parent.left;
          }
          hash = hashFunction(sibling.hash + hash);
          current = parent;
      }
      return hash === this.root.hash;
  }

    findNode(value) {
        return this.leaves.find((leaf) => leaf.value === value);
    }

    getHeight(node) {
        if (!node) {
            return 0;
        }
        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    };
}

const mt = new MerkleTree(['b', 'c','a']);
console.log(mt.verify('a')); // true
mt.addNode('d');
console.log(mt.verify('d')); // true
console.log(mt.verify('f')); // false
mt.deleteNode('c');
console.log(mt.verify('c')); // false
console.log(mt.getHeight(mt.root)); // 2