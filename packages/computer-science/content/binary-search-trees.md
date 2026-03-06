---
title: Binary Search Trees
chapter: computer-science
type: data-structure
difficulty: intermediate
prerequisites:
  - "[[Trees]]"
  - "[[Recursion]]"
  - "[[Binary Search]]"
  - "[[Big O Notation]]"
related:
  - "[[AVL Trees]]"
  - "[[Red-Black Trees]]"
  - "[[Heaps]]"
  - "[[Hash Tables]]"
  - "[[Arrays]]"
tags:
  - data-structures
  - trees
  - binary-search-trees
  - searching
  - sorting
status: draft
created: "2026-03-06"
updated: "2026-03-06"
author: Content Writer
---

# Binary Search Trees

## Overview

A Binary Search Tree (BST) is a binary tree that maintains a simple but powerful ordering property: for every node, all values in the left subtree are smaller, and all values in the right subtree are larger. This property turns a tree into a searchable structure with logarithmic performance.

Think of a BST like a "guess the number" game where someone says "higher" or "lower" after each guess. Each comparison eliminates half the remaining possibilities. A BST does the same thing: each node comparison eliminates an entire subtree from your search.

This makes BSTs the foundation for countless applications:
- **Databases:** B-trees and B+ trees (variants of BSTs) power database indices
- **File systems:** Directory structures often use BST-like organization
- **Language features:** C++ `std::map`, Java `TreeMap`, Python's sorted containers
- **Real-time systems:** Priority queues, event schedulers, network routing tables

## Core Concept

The **Binary Search Tree property** is deceptively simple:

**For every node in the tree:**
- All nodes in the **left subtree** have values **less than** the node's value
- All nodes in the **right subtree** have values **greater than** the node's value
- Both subtrees are themselves Binary Search Trees

This recursive property must hold for every single node, not just the root.

### Example BST

```
       50
      /  \
    30    70
   /  \   / \
  20  40 60  80

✓ For node 50: left subtree (20,30,40) < 50 < right subtree (60,70,80)
✓ For node 30: left (20) < 30 < right (40)
✓ For node 70: left (60) < 70 < right (80)
```

### Not a BST

```
       50
      /  \
    30    70
   /  \   / \
  20  40 65  80
       ^
       55 <- WRONG! 55 < 50, should be in left subtree

✗ Node 55 is in the right subtree of 50, but 55 < 50
```

The key insight: it's not enough to just compare with the parent. Every node's entire left subtree must be less than it, and entire right subtree must be greater.

## BST Operations

### Search

Searching exploits the BST property to eliminate half the tree at each step, just like binary search on sorted arrays.

**Algorithm:**
1. Start at root
2. If target equals current node, found!
3. If target is less than current node, search left subtree
4. If target is greater than current node, search right subtree
5. If you reach null, target doesn't exist

```python
def search(node, target):
    """Search for target value in BST."""
    # Base case: reached end or found value
    if node is None:
        return False
    if node.value == target:
        return True

    # Recursive case: go left or right
    if target < node.value:
        return search(node.left, target)
    else:
        return search(node.right, target)
```

**Visual example - searching for 60:**

```
Search 60:
       50  <- 60 > 50, go right
      /  \
    30    70  <- 60 < 70, go left
   /  \   / \
  20  40 60  80  <- 60 == 60, found!
         ^

Path taken: 50 → 70 → 60 (3 comparisons)
```

**Time Complexity:** O(h) where h is height
- Balanced tree: O(log n)
- Unbalanced tree: O(n)

### Insert

Insertion follows the same path as search, then adds the new node as a leaf.

**Algorithm:**
1. Start at root
2. If value is less than current node, go left
3. If value is greater than current node, go right
4. When you reach null, insert the new node there

```python
def insert(node, value):
    """Insert value into BST, return new root."""
    # Base case: found insertion point
    if node is None:
        return TreeNode(value)

    # Recursive case: go left or right
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)

    return node
```

**Visual example - inserting 65:**

```
Initial tree:
       50
      /  \
    30    70
   /  \   / \
  20  40 60  80

Step 1: 65 > 50, go right
       50
         \
          70

Step 2: 65 < 70, go left
          70
         /
        60

Step 3: 65 > 60, go right (null), insert here
        60
          \
           65 (NEW)

Final tree:
       50
      /  \
    30    70
   /  \   / \
  20  40 60  80
           \
            65
```

**Time Complexity:** O(h) - same as search

### Delete

Deletion is the most complex BST operation because you must maintain the BST property while removing a node. There are three cases:

**Case 1: Node has no children (leaf)**
Simply remove it.

```
Delete 20:
       50              50
      /  \            /  \
    30    70   =>   30    70
   /  \   / \         \   / \
  20  40 60  80       40 60  80
  ^
  Remove this leaf
```

**Case 2: Node has one child**
Replace the node with its child.

```
Delete 30 (has only right child):
       50              50
      /  \            /  \
    30    70   =>   40    70
      \   / \           / \
      40 60  80        60  80
  ^
  Replace 30 with 40
```

**Case 3: Node has two children**
This is the tricky case. You can't just remove it because there are two subtrees to handle. Solution:
1. Find the **inorder successor** (smallest node in right subtree)
2. Copy successor's value to the node being deleted
3. Delete the successor (which has at most one child)

```
Delete 50 (has two children):
       50                 60
      /  \               /  \
    30    70    =>     30    70
   /  \   / \         /  \     \
  20  40 60  80      20  40    80
         ^
    Inorder successor (smallest in right subtree)

Step 1: Find successor (60)
Step 2: Copy 60 to replace 50
Step 3: Delete original 60 node
```

**Alternative:** Use **inorder predecessor** (largest in left subtree) instead of successor. Both work.

```python
def delete(node, value):
    """Delete value from BST, return new root."""
    if node is None:
        return None

    # Find the node to delete
    if value < node.value:
        node.left = delete(node.left, value)
    elif value > node.value:
        node.right = delete(node.right, value)
    else:
        # Found the node to delete

        # Case 1: No children (leaf)
        if node.left is None and node.right is None:
            return None

        # Case 2a: Only right child
        if node.left is None:
            return node.right

        # Case 2b: Only left child
        if node.right is None:
            return node.left

        # Case 3: Two children
        # Find inorder successor (min value in right subtree)
        successor = find_min(node.right)
        node.value = successor.value
        # Delete the successor
        node.right = delete(node.right, successor.value)

    return node

def find_min(node):
    """Find minimum value node (leftmost)."""
    while node.left is not None:
        node = node.left
    return node
```

**Time Complexity:** O(h) - must find node, then potentially find successor

## Tree Traversals and BSTs

Tree traversals visit every node, but the order matters. For BSTs, **inorder traversal** has a special property.

### Inorder Traversal (Left, Root, Right)

Inorder traversal on a BST visits nodes in **sorted order**. This is the key reason BSTs are useful.

```python
def inorder(node):
    """Inorder traversal - gives sorted output for BST."""
    if node is None:
        return
    inorder(node.left)      # Visit left (smaller values)
    print(node.value)        # Visit root
    inorder(node.right)      # Visit right (larger values)

# For our example tree:
#        50
#       /  \
#     30    70
#    /  \   / \
#   20  40 60  80
#
# Output: 20, 30, 40, 50, 60, 70, 80 (sorted!)
```

**Why it works:** The BST property guarantees left < root < right. Visiting in that order produces sorted sequence.

**Practical use:** Convert BST to sorted array in O(n) time.

### Other Traversals

**Preorder (Root, Left, Right):** Useful for copying tree structure
```python
# Output: 50, 30, 20, 40, 70, 60, 80
```

**Postorder (Left, Right, Root):** Useful for deleting tree (delete children first)
```python
# Output: 20, 40, 30, 60, 80, 70, 50
```

**Level-order (BFS):** Visit by levels, not useful for sorted output
```python
# Output: 50, 30, 70, 20, 40, 60, 80
```

## Time Complexity Analysis

BST performance depends critically on tree **height**.

| Operation | Balanced BST | Unbalanced BST |
|-----------|--------------|----------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Find min/max | O(log n) | O(n) |
| Inorder traversal | O(n) | O(n) |

### Balanced Tree: O(log n) Height

A balanced tree with n nodes has height approximately log₂(n).

```
n = 7 nodes, height = 2 (log₂7 ≈ 2.8)
       4
      / \
     2   6
    / \ / \
   1  3 5  7

Every level doubles the capacity.
Search touches at most 3 nodes.
```

### Unbalanced Tree: O(n) Height

Inserting sorted data creates a degenerate tree (linked list).

```
Insert: 1, 2, 3, 4, 5, 6, 7

n = 7 nodes, height = 6 (O(n))
1
 \
  2
   \
    3
     \
      4
       \
        5
         \
          6
           \
            7

Search for 7 touches all 7 nodes!
No better than a linked list.
```

**Key insight:** BST performance depends on balance. Without balancing, a BST can degrade to O(n) operations.

## Comparison with Other Data Structures

### BST vs Sorted Array

| Operation | BST (balanced) | Sorted Array |
|-----------|----------------|--------------|
| Search | O(log n) | O(log n) |
| Insert | O(log n) | O(n) - must shift |
| Delete | O(log n) | O(n) - must shift |
| Find min/max | O(log n) | O(1) |
| Memory | O(n) + pointers | O(n) |
| Cache-friendly | ✗ | ✓ |

**When to prefer BST:** Dynamic data with frequent insertions/deletions.

**When to prefer sorted array:** Static or mostly-read data, need cache performance.

### BST vs Hash Table

| Operation | BST (balanced) | Hash Table |
|-----------|----------------|------------|
| Search | O(log n) | O(1) average |
| Insert | O(log n) | O(1) average |
| Delete | O(log n) | O(1) average |
| Find min/max | O(log n) | O(n) |
| Sorted order | ✓ (free) | ✗ |
| Range queries | O(log n + k) | O(n) |

**When to prefer BST:** Need sorted order, range queries, min/max operations.

**When to prefer hash table:** Only need lookup/insert/delete, no ordering required.

### Example: Range Queries

BSTs excel at finding all values in a range.

```python
def range_query(node, low, high):
    """Find all values in [low, high] range."""
    if node is None:
        return []

    result = []

    # If current node is in range, include it
    if low <= node.value <= high:
        result.append(node.value)

    # Search left if there could be values in range
    if low < node.value:
        result.extend(range_query(node.left, low, high))

    # Search right if there could be values in range
    if high > node.value:
        result.extend(range_query(node.right, low, high))

    return sorted(result)

# Find all values between 35 and 65:
#        50
#       /  \
#     30    70
#    /  \   / \
#   20  40 60  80
#
# Result: [40, 50, 60]
# Time: O(log n + k) where k = number of results
```

Hash tables would need to check all n keys: O(n).

## When BSTs Become Inefficient

BSTs degenerate to linked lists in these scenarios:

**1. Inserting sorted data**
```python
bst = BST()
for i in [1, 2, 3, 4, 5]:  # Sorted!
    bst.insert(i)

# Result: Right-skewed tree (linked list)
# Height: O(n) instead of O(log n)
```

**2. Inserting reverse-sorted data**
```python
for i in [5, 4, 3, 2, 1]:  # Reverse sorted!
    bst.insert(i)

# Result: Left-skewed tree (linked list)
```

**3. Repeated insertions at one end**
```python
# Insert: 50, 60, 70, 80, 90...
# All go to the right, creating imbalance
```

**Solution:** Use self-balancing trees (AVL, Red-Black) that automatically maintain O(log n) height.

## Balanced BSTs: A Preview

Plain BSTs don't guarantee balance. **Self-balancing trees** fix this.

### AVL Trees
- Maintains strict balance: height difference ≤ 1 for every node
- Uses rotations after insert/delete to restore balance
- Fastest search among balanced trees
- Slightly slower insert/delete due to strict balance

### Red-Black Trees
- Maintains looser balance using node colors
- Height ≤ 2×log₂(n)
- Faster insert/delete than AVL
- Used in C++ `std::map`, Java `TreeMap`, Linux kernel

Both guarantee O(log n) height, making all operations O(log n) in worst case.

## Complete Implementation

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
        """Insert value into BST."""
        self.root = self._insert_recursive(self.root, value)

    def _insert_recursive(self, node, value):
        if node is None:
            return TreeNode(value)

        if value < node.value:
            node.left = self._insert_recursive(node.left, value)
        else:
            node.right = self._insert_recursive(node.right, value)

        return node

    def search(self, value):
        """Search for value in BST."""
        return self._search_recursive(self.root, value)

    def _search_recursive(self, node, value):
        if node is None:
            return False
        if node.value == value:
            return True

        if value < node.value:
            return self._search_recursive(node.left, value)
        else:
            return self._search_recursive(node.right, value)

    def delete(self, value):
        """Delete value from BST."""
        self.root = self._delete_recursive(self.root, value)

    def _delete_recursive(self, node, value):
        if node is None:
            return None

        # Find the node
        if value < node.value:
            node.left = self._delete_recursive(node.left, value)
        elif value > node.value:
            node.right = self._delete_recursive(node.right, value)
        else:
            # Found node to delete

            # Case 1: Leaf node
            if node.left is None and node.right is None:
                return None

            # Case 2: One child
            if node.left is None:
                return node.right
            if node.right is None:
                return node.left

            # Case 3: Two children
            successor = self._find_min(node.right)
            node.value = successor.value
            node.right = self._delete_recursive(node.right, successor.value)

        return node

    def _find_min(self, node):
        """Find minimum value node."""
        while node.left is not None:
            node = node.left
        return node

    def _find_max(self, node):
        """Find maximum value node."""
        while node.right is not None:
            node = node.right
        return node

    def find_min(self):
        """Find minimum value in tree."""
        if self.root is None:
            return None
        return self._find_min(self.root).value

    def find_max(self):
        """Find maximum value in tree."""
        if self.root is None:
            return None
        return self._find_max(self.root).value

    def inorder_traversal(self):
        """Return sorted list of values."""
        result = []
        self._inorder_recursive(self.root, result)
        return result

    def _inorder_recursive(self, node, result):
        if node is not None:
            self._inorder_recursive(node.left, result)
            result.append(node.value)
            self._inorder_recursive(node.right, result)

    def height(self):
        """Calculate tree height."""
        return self._height_recursive(self.root)

    def _height_recursive(self, node):
        if node is None:
            return -1  # Height of empty tree is -1

        left_height = self._height_recursive(node.left)
        right_height = self._height_recursive(node.right)

        return 1 + max(left_height, right_height)

# Usage example
bst = BinarySearchTree()
values = [50, 30, 70, 20, 40, 60, 80]

for val in values:
    bst.insert(val)

print(bst.search(40))           # True
print(bst.search(25))           # False
print(bst.find_min())           # 20
print(bst.find_max())           # 80
print(bst.inorder_traversal())  # [20, 30, 40, 50, 60, 70, 80]
print(bst.height())             # 2

bst.delete(30)
print(bst.inorder_traversal())  # [20, 40, 50, 60, 70, 80]
```

## Common Pitfalls

**Missing base case in recursion:**
```python
def search(node, value):
    # Forgot: if node is None: return False
    if node.value == value:
        return True
    # Will crash when reaching null!
```

**Not handling the root correctly in delete:**
```python
def delete(self, value):
    self._delete_recursive(self.root, value)
    # Forgot to update self.root!
    # Should be: self.root = self._delete_recursive(self.root, value)
```

**Forgetting BST property applies to entire subtrees:**
```python
# Wrong: Just checking parent
if node.value < node.parent.value:
    # This doesn't guarantee all ancestors are satisfied

# Right: The property must hold for entire subtree
```

**Assuming BST is always balanced:**
```python
# Never assume O(log n) without balancing
# Plain BST can degrade to O(n)
# Use AVL or Red-Black for guaranteed performance
```

**Not handling duplicates consistently:**
```python
# Decide upfront:
# Option 1: Allow duplicates (insert right if equal)
# Option 2: Reject duplicates
# Option 3: Store count in node

# Be consistent across insert/search/delete
```

## When to Use

**Use Binary Search Trees when:**
- You need both fast search AND dynamic insertions (O(log n) for both)
- You need to maintain sorted order efficiently
- You frequently need min/max values
- You need range queries (find all values between x and y)
- You're building more advanced structures (priority queues, symbol tables)

**Don't use BSTs when:**
- You only need lookup/insert/delete without ordering (use [[Hash Tables]] for O(1))
- Data is static or rarely changes (use sorted array with binary search)
- You need guaranteed O(log n) worst-case (use balanced BSTs: [[AVL Trees]], [[Red-Black Trees]])
- Memory overhead is critical (BSTs use extra pointers)
- Cache performance matters (arrays are more cache-friendly)

## See Also

- [[Trees]] - Foundation concepts
- [[Binary Search]] - The algorithm BSTs are based on
- [[AVL Trees]] - Self-balancing BSTs with strict balance
- [[Red-Black Trees]] - Self-balancing BSTs with looser balance
- [[Heaps]] - Different tree structure optimized for priority queues
- [[Hash Tables]] - Alternative for fast lookup without ordering
- [[B-Trees]] - Multi-way trees for databases

## References

- Introduction to Algorithms (CLRS), Chapter 12 (Binary Search Trees)
- [Binary Search Tree Visualization](https://visualgo.net/en/bst)
- The Art of Computer Programming, Volume 3 (Knuth), Section 6.2.2
- [C++ std::map implementation (Red-Black Tree)](https://gcc.gnu.org/onlinedocs/libstdc++/)
