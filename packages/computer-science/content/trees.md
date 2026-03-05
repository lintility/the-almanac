---
title: Trees and Binary Search Trees
chapter: computer-science
type: data-structure
difficulty: intermediate
prerequisites:
  - "[[Arrays]]"
  - "[[Recursion]]"
  - "[[Big O Notation]]"
related:
  - "[[Graphs]]"
  - "[[Heaps]]"
  - "[[Hash Tables]]"
  - "[[Depth-First Search]]"
  - "[[Breadth-First Search]]"
tags:
  - data-structures
  - trees
  - binary-trees
  - binary-search-trees
  - recursion
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Trees and Binary Search Trees

## Overview

A tree is a hierarchical data structure composed of nodes connected by edges, with a single root node at the top and child nodes branching downward. Think of it like a family tree or an organizational chart: one node at the top, with branches leading to other nodes below.

Unlike linear data structures (arrays, linked lists), trees are **hierarchical** and **non-linear**. This structure mirrors many real-world relationships: file systems, HTML DOM trees, decision trees, and organizational hierarchies.

## Core Concept

Trees organize data in **parent-child relationships**. Each node can have multiple children, but only one parent. The top node (with no parent) is the **root**. Nodes with no children are **leaves**.

This hierarchical structure enables **divide-and-conquer algorithms** and **efficient searching**, making trees foundational for databases, compilers, AI decision-making, and much more.

## Tree Terminology

Understanding trees requires learning its vocabulary:

- **Root:** The topmost node (has no parent)
- **Parent:** A node with children below it
- **Child:** A node with a parent above it
- **Leaf (External node):** A node with no children
- **Internal node:** A node with at least one child
- **Edge:** The connection between two nodes
- **Path:** A sequence of edges connecting nodes
- **Height:** The length of the longest path from a node to a leaf
- **Depth (Level):** The length of the path from the root to a node
- **Subtree:** A node and all its descendants form a tree

```
       A         ← Root (depth 0, height 3)
      / \
     B   C       ← Internal nodes (depth 1)
    / \   \
   D   E   F     ← D, E, F are leaves (depth 2)
  /
 G               ← G is a leaf (depth 3)

Height of tree: 3 (longest path from root to leaf)
```

## Binary Trees

A **binary tree** is a tree where each node has **at most two children**, commonly called the **left child** and **right child**.

### Properties

- Maximum nodes at level *i*: `2^i` nodes
- Maximum nodes in a tree of height *h*: `2^(h+1) - 1` nodes
- Minimum height for *n* nodes: `log₂(n)` levels

### Types of Binary Trees

**Full Binary Tree:** Every node has 0 or 2 children (no nodes with only 1 child).

```
       A
      / \
     B   C
    / \
   D   E
```

**Complete Binary Tree:** All levels are fully filled except possibly the last level, which fills from left to right.

```
       A
      / \
     B   C
    / \  /
   D  E F
```

**Perfect Binary Tree:** All internal nodes have exactly 2 children, and all leaves are at the same level.

```
       A
      / \
     B   C
    / \ / \
   D  E F  G
```

**Balanced Binary Tree:** Height difference between left and right subtrees is at most 1 for every node.

```
       A
      / \
     B   C
    /     \
   D       E
```

## Binary Search Trees (BST)

A **Binary Search Tree** is a binary tree with a special ordering property:

**For every node:**
- All nodes in the **left subtree** have values **less than** the node
- All nodes in the **right subtree** have values **greater than** the node

This property enables **efficient searching**, similar to binary search on arrays.

### Example BST

```
       50
      /  \
    30    70
   /  \   / \
  20  40 60  80

- All left descendants of 50 (20, 30, 40) are < 50
- All right descendants of 50 (60, 70, 80) are > 50
- This holds for every node
```

### Why BSTs Matter

BSTs combine the **fast search** of binary search (O(log n)) with the **dynamic insertion** that arrays lack. Unlike sorted arrays, BSTs can insert and delete without shifting elements.

## Tree Traversals

Tree traversal is the process of visiting every node exactly once. The order matters.

### Depth-First Traversals (DFS)

**1. Inorder (Left, Root, Right)**
- Visits nodes in **sorted order** for a BST
- Use case: Get sorted sequence from BST

```python
def inorder(node):
    if node is None:
        return
    inorder(node.left)      # Visit left subtree
    print(node.value)        # Visit root
    inorder(node.right)      # Visit right subtree

# For BST above: 20, 30, 40, 50, 60, 70, 80
```

**2. Preorder (Root, Left, Right)**
- Visits root first
- Use case: Copy tree, prefix expression evaluation

```python
def preorder(node):
    if node is None:
        return
    print(node.value)        # Visit root first
    preorder(node.left)      # Visit left subtree
    preorder(node.right)     # Visit right subtree

# For BST above: 50, 30, 20, 40, 70, 60, 80
```

**3. Postorder (Left, Right, Root)**
- Visits root last
- Use case: Delete tree, postfix expression evaluation

```python
def postorder(node):
    if node is None:
        return
    postorder(node.left)     # Visit left subtree
    postorder(node.right)    # Visit right subtree
    print(node.value)        # Visit root last

# For BST above: 20, 40, 30, 60, 80, 70, 50
```

### Breadth-First Traversal (BFS)

**Level-order traversal** visits nodes level by level, left to right.

```python
from collections import deque

def level_order(root):
    if root is None:
        return

    queue = deque([root])
    while queue:
        node = queue.popleft()
        print(node.value)

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

# For BST above: 50, 30, 70, 20, 40, 60, 80
```

## Time Complexity

| Operation | Balanced BST | Unbalanced BST | Array (sorted) |
|-----------|--------------|----------------|----------------|
| Search | O(log n) | O(n) | O(log n) |
| Insert | O(log n) | O(n) | O(n) |
| Delete | O(log n) | O(n) | O(n) |
| Find min/max | O(log n) | O(n) | O(1) |
| Traversal | O(n) | O(n) | O(n) |

**Space Complexity:**
- Tree storage: O(n) for n nodes
- Recursive traversal: O(h) stack space, where h is height

**Key insight:** BST performance depends on balance. A balanced tree with height `log n` gives O(log n) operations. An unbalanced tree degenerates to O(n), like a linked list.

## Implementation: Binary Search Tree (Python)

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, value):
        """Insert a value into the BST."""
        if self.root is None:
            self.root = TreeNode(value)
        else:
            self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        """Helper function to insert recursively."""
        if value < node.value:
            # Go left
            if node.left is None:
                node.left = TreeNode(value)
            else:
                self._insert_recursive(node.left, value)
        else:
            # Go right (handles duplicates by placing right)
            if node.right is None:
                node.right = TreeNode(value)
            else:
                self._insert_recursive(node.right, value)

    def search(self, value):
        """Search for a value in the BST."""
        return self._search_recursive(self.root, value)

    def _search_recursive(self, node, value):
        """Helper function to search recursively."""
        # Base case: reached end or found value
        if node is None:
            return False
        if node.value == value:
            return True

        # Recursive case: go left or right
        if value < node.value:
            return self._search_recursive(node.left, value)
        else:
            return self._search_recursive(node.right, value)

    def find_min(self):
        """Find the minimum value (leftmost node)."""
        if self.root is None:
            return None
        current = self.root
        while current.left is not None:
            current = current.left
        return current.value

    def find_max(self):
        """Find the maximum value (rightmost node)."""
        if self.root is None:
            return None
        current = self.root
        while current.right is not None:
            current = current.right
        return current.value

    def inorder_traversal(self):
        """Return list of values in sorted order."""
        result = []
        self._inorder_recursive(self.root, result)
        return result

    def _inorder_recursive(self, node, result):
        """Helper function for inorder traversal."""
        if node is not None:
            self._inorder_recursive(node.left, result)
            result.append(node.value)
            self._inorder_recursive(node.right, result)

# Usage
bst = BinarySearchTree()
values = [50, 30, 70, 20, 40, 60, 80]

for val in values:
    bst.insert(val)

print(bst.search(40))  # True
print(bst.search(25))  # False
print(bst.find_min())  # 20
print(bst.find_max())  # 80
print(bst.inorder_traversal())  # [20, 30, 40, 50, 60, 70, 80]
```

## Implementation: Tree Node (C)

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int value;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

TreeNode* create_node(int value) {
    TreeNode* node = (TreeNode*)malloc(sizeof(TreeNode));
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

TreeNode* insert(TreeNode* root, int value) {
    if (root == NULL) {
        return create_node(value);
    }

    if (value < root->value) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }

    return root;
}

int search(TreeNode* root, int value) {
    if (root == NULL) {
        return 0;  // Not found
    }

    if (root->value == value) {
        return 1;  // Found
    }

    if (value < root->value) {
        return search(root->left, value);
    } else {
        return search(root->right, value);
    }
}

void inorder(TreeNode* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->value);
        inorder(root->right);
    }
}

int main() {
    TreeNode* root = NULL;

    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    insert(root, 20);
    insert(root, 40);
    insert(root, 60);
    insert(root, 80);

    printf("Inorder traversal: ");
    inorder(root);  // 20 30 40 50 60 70 80
    printf("\n");

    printf("Search 40: %d\n", search(root, 40));  // 1
    printf("Search 25: %d\n", search(root, 25));  // 0

    return 0;
}
```

## Balanced vs Unbalanced Trees

### Unbalanced BST (Degenerate Tree)

If you insert sorted data into a BST, it degenerates into a **linked list**:

```python
bst = BinarySearchTree()
for i in [10, 20, 30, 40, 50]:
    bst.insert(i)

# Resulting tree:
#   10
#     \
#      20
#        \
#         30
#           \
#            40
#              \
#               50

# Height: 5 (O(n))
# Search time: O(n) - no better than a linked list!
```

### Balanced BST

Self-balancing trees maintain O(log n) height:

**Common self-balancing trees:**
- **AVL Tree:** Strict balance, fastest search
- **Red-Black Tree:** Less strict balance, faster insert/delete (used in C++ `std::map`)
- **B-Tree:** Multi-way tree for databases
- **Splay Tree:** Recently accessed nodes move to top

These trees use **rotations** to rebalance after insertions/deletions, ensuring height stays O(log n).

## Key Properties

**Advantages:**
- **Fast search:** O(log n) in balanced trees
- **Sorted order:** Inorder traversal gives sorted sequence
- **Dynamic:** No need to shift elements like arrays
- **Hierarchical:** Natural fit for hierarchical data
- **Flexible:** Easy to extend for advanced needs (AVL, Red-Black)

**Disadvantages:**
- **Not cache-friendly:** Nodes scattered in memory (unlike arrays)
- **Overhead:** Each node needs two pointers (8-16 bytes)
- **Balance required:** Unbalanced trees degrade to O(n)
- **More complex:** Harder to implement than arrays or linked lists

## Common Pitfalls

**Forgetting the base case in recursion:**
```python
def search(node, value):
    # Missing: if node is None: return False
    if node.value == value:
        return True
    # This will crash on null nodes!
```

**Not handling duplicates:**
Different BST implementations handle duplicates differently. Decide upfront:
- Allow duplicates (go right if equal)
- Reject duplicates
- Count duplicates in node

**Forgetting to update parent pointers:**
If you track parent pointers, remember to update them during insertion/deletion.

**Assuming BST is always balanced:**
Without balancing, a BST can degrade to O(n) operations. Use self-balancing trees (AVL, Red-Black) for guaranteed performance.

**Comparing pointers instead of values:**
```python
if node.left == 50:  # Wrong! Comparing node to int
if node.left.value == 50:  # Correct!
```

## When to Use

**Use trees when:**
- You need fast search AND dynamic insertions (O(log n) for both)
- Data has natural hierarchical structure (file systems, org charts)
- You need sorted traversal (inorder on BST)
- Implementing advanced structures (heaps, tries, segment trees)

**Don't use trees when:**
- You need O(1) lookups (use [[Hash Tables]])
- Data is mostly static (use sorted arrays with binary search)
- Memory overhead matters (trees use extra pointers)
- Cache performance is critical (use arrays)

## See Also

- [[Binary Search]]
- [[Recursion]]
- [[Graphs]]
- [[Heaps]]
- [[Hash Tables]]
- [[Depth-First Search]]
- [[Breadth-First Search]]
- [[AVL Trees]]
- [[Red-Black Trees]]

## References

- Introduction to Algorithms (CLRS), Chapter 12 (Binary Search Trees)
- [Binary Tree Visualization](https://visualgo.net/en/bst)
- The Art of Computer Programming, Volume 1 (Knuth), Section 2.3
- [C++ std::map implementation (Red-Black Tree)](https://gcc.gnu.org/onlinedocs/libstdc++/libstdc++-html-USERS-4.1/stl__tree_8h-source.html)
