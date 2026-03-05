---
title: Linked Lists
chapter: computer-science
type: data-structure
difficulty: beginner
prerequisites:
  - "[[Variables]]"
  - "[[Pointers and References]]"
  - "[[Memory Management]]"
related:
  - "[[Arrays]]"
  - "[[Stacks]]"
  - "[[Queues]]"
  - "[[Trees]]"
  - "[[Big O Notation]]"
tags:
  - data-structures
  - linked-lists
  - pointers
  - fundamentals
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Linked Lists

## Overview

A linked list is a collection of elements (called nodes) where each element contains data and a reference (pointer) to the next element in the sequence. Think of it like a scavenger hunt: each clue tells you where to find the next clue, and you follow the chain until you reach the end.

Unlike arrays where elements sit side-by-side in memory, linked list nodes can be scattered anywhere in memory. They stay connected through references, like houses on different streets connected by a trail of breadcrumbs.

Linked lists trade array's fast indexing for fast insertion and deletion. They excel when you need to frequently add or remove elements but rarely need to jump to specific positions.

## Core Concept

Each node in a linked list contains two things:
1. **Data:** The actual value being stored
2. **Next:** A reference (pointer) to the next node

The list maintains a reference to the first node (called the **head**). To access any element, you start at the head and follow the chain of next references until you reach your target.

```
head → [Data|Next] → [Data|Next] → [Data|Next] → null
       Node 1         Node 2         Node 3
```

The last node's next reference points to `null` (or `None`), indicating the end of the list.

**Key insight:** Unlike arrays, you can't jump directly to the 100th element. You must traverse through all 99 preceding elements. This is why access is O(n) instead of O(1).

## Types of Linked Lists

### Singly Linked List

Each node points only to the next node. You can traverse in one direction only: forward.

```
head → [1|→] → [2|→] → [3|→] → [4|null]
```

**Characteristics:**
- Simplest implementation
- Traverse forward only
- Each node needs one pointer
- Cannot easily go backwards

### Doubly Linked List

Each node has two pointers: one to the next node and one to the previous node. You can traverse both forward and backward.

```
null ← [prev|1|next] ↔ [prev|2|next] ↔ [prev|3|next] → null
       head
```

**Characteristics:**
- Bidirectional traversal
- Each node needs two pointers
- More memory per node
- Easier to delete a specific node
- Can traverse from tail to head

### Circular Linked List

The last node points back to the first node instead of null, forming a circle.

```
head → [1|→] → [2|→] → [3|→] → [4|→]
       ↑________________________________|
```

**Characteristics:**
- No natural end
- Useful for round-robin scheduling
- Must track when you've completed a full loop
- Can be singly or doubly linked

## Time Complexity

| Operation | Singly Linked List | Doubly Linked List | Array (for comparison) |
|-----------|-------------------|-------------------|----------------------|
| Access by index | O(n) | O(n) | O(1) |
| Search (unsorted) | O(n) | O(n) | O(n) |
| Insert at head | O(1) | O(1) | O(n) |
| Insert at tail | O(n)* | O(1)** | O(1) amortized |
| Insert in middle | O(n) | O(n) | O(n) |
| Delete at head | O(1) | O(1) | O(n) |
| Delete at tail | O(n) | O(1)** | O(1) |
| Delete in middle | O(n) | O(n)*** | O(n) |

**Notes:**
- *Requires traversal to find tail, unless you maintain a tail pointer (then O(1))
- **Assumes you maintain a tail pointer
- ***O(1) if you already have a reference to the node to delete

**Space Complexity:** O(n) for n elements, but higher per-element overhead than arrays (extra pointer(s))

## Example: Building a Singly Linked List

```python
# Define a node
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

# Create nodes
node1 = Node(10)
node2 = Node(20)
node3 = Node(30)

# Link them together
node1.next = node2  # 10 → 20
node2.next = node3  # 20 → 30
node3.next = None   # 30 → null

# Traverse the list
current = node1  # Start at head
while current is not None:
    print(current.data)  # 10, 20, 30
    current = current.next  # Move to next node
```

## Implementation: Singly Linked List

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def is_empty(self):
        return self.head is None

    def insert_at_head(self, data):
        """Insert new node at the beginning - O(1)"""
        new_node = Node(data)
        new_node.next = self.head  # New node points to old head
        self.head = new_node       # Update head to new node
        self.size += 1

    def insert_at_tail(self, data):
        """Insert new node at the end - O(n)"""
        new_node = Node(data)

        if self.is_empty():
            self.head = new_node
        else:
            # Traverse to the last node
            current = self.head
            while current.next is not None:
                current = current.next

            # Attach new node at the end
            current.next = new_node

        self.size += 1

    def delete_at_head(self):
        """Remove first node - O(1)"""
        if self.is_empty():
            raise Exception("Cannot delete from empty list")

        deleted_data = self.head.data
        self.head = self.head.next  # Move head to second node
        self.size -= 1
        return deleted_data

    def search(self, data):
        """Find node with given data - O(n)"""
        current = self.head
        while current is not None:
            if current.data == data:
                return True
            current = current.next
        return False

    def get(self, index):
        """Access element by index - O(n)"""
        if index < 0 or index >= self.size:
            raise IndexError("Index out of range")

        current = self.head
        for _ in range(index):
            current = current.next

        return current.data

    def delete_value(self, data):
        """Delete first node with given value - O(n)"""
        if self.is_empty():
            return False

        # Special case: deleting head
        if self.head.data == data:
            self.head = self.head.next
            self.size -= 1
            return True

        # Find the node before the one to delete
        current = self.head
        while current.next is not None:
            if current.next.data == data:
                # Skip over the node to delete
                current.next = current.next.next
                self.size -= 1
                return True
            current = current.next

        return False  # Value not found

    def __len__(self):
        return self.size

    def __str__(self):
        """String representation of list"""
        if self.is_empty():
            return "[]"

        result = []
        current = self.head
        while current is not None:
            result.append(str(current.data))
            current = current.next

        return "[" + " → ".join(result) + "]"

# Usage
linked_list = SinglyLinkedList()

# Insert at head (fast)
linked_list.insert_at_head(30)  # [30]
linked_list.insert_at_head(20)  # [20 → 30]
linked_list.insert_at_head(10)  # [10 → 20 → 30]

print(linked_list)  # [10 → 20 → 30]

# Insert at tail
linked_list.insert_at_tail(40)  # [10 → 20 → 30 → 40]
print(linked_list)

# Search
print(linked_list.search(20))  # True
print(linked_list.search(99))  # False

# Access by index (slow compared to array)
print(linked_list.get(2))  # 30

# Delete
linked_list.delete_value(20)  # [10 → 30 → 40]
print(linked_list)

# Delete head
linked_list.delete_at_head()  # [30 → 40]
print(linked_list)
```

## Implementation: Doubly Linked List

```python
class DoublyNode:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self.size = 0

    def is_empty(self):
        return self.head is None

    def insert_at_head(self, data):
        """Insert at beginning - O(1)"""
        new_node = DoublyNode(data)

        if self.is_empty():
            self.head = self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node

        self.size += 1

    def insert_at_tail(self, data):
        """Insert at end - O(1) with tail pointer"""
        new_node = DoublyNode(data)

        if self.is_empty():
            self.head = self.tail = new_node
        else:
            new_node.prev = self.tail
            self.tail.next = new_node
            self.tail = new_node

        self.size += 1

    def delete_at_head(self):
        """Remove first node - O(1)"""
        if self.is_empty():
            raise Exception("Cannot delete from empty list")

        deleted_data = self.head.data

        if self.head == self.tail:  # Only one node
            self.head = self.tail = None
        else:
            self.head = self.head.next
            self.head.prev = None

        self.size -= 1
        return deleted_data

    def delete_at_tail(self):
        """Remove last node - O(1) with tail pointer"""
        if self.is_empty():
            raise Exception("Cannot delete from empty list")

        deleted_data = self.tail.data

        if self.head == self.tail:  # Only one node
            self.head = self.tail = None
        else:
            self.tail = self.tail.prev
            self.tail.next = None

        self.size -= 1
        return deleted_data

    def delete_node(self, node):
        """Delete a specific node - O(1) if you have reference"""
        if node is None:
            return

        # Update previous node's next pointer
        if node.prev:
            node.prev.next = node.next
        else:
            # Deleting head
            self.head = node.next

        # Update next node's prev pointer
        if node.next:
            node.next.prev = node.prev
        else:
            # Deleting tail
            self.tail = node.prev

        self.size -= 1

    def traverse_forward(self):
        """Print list from head to tail"""
        result = []
        current = self.head
        while current is not None:
            result.append(str(current.data))
            current = current.next
        return " ↔ ".join(result)

    def traverse_backward(self):
        """Print list from tail to head"""
        result = []
        current = self.tail
        while current is not None:
            result.append(str(current.data))
            current = current.prev
        return " ↔ ".join(result)

    def __str__(self):
        return "[" + self.traverse_forward() + "]"

# Usage
dll = DoublyLinkedList()

# Insert at head
dll.insert_at_head(20)  # [20]
dll.insert_at_head(10)  # [10 ↔ 20]

# Insert at tail (now O(1)!)
dll.insert_at_tail(30)  # [10 ↔ 20 ↔ 30]
dll.insert_at_tail(40)  # [10 ↔ 20 ↔ 30 ↔ 40]

print(dll)

# Traverse forward
print("Forward:", dll.traverse_forward())   # 10 ↔ 20 ↔ 30 ↔ 40

# Traverse backward
print("Backward:", dll.traverse_backward()) # 40 ↔ 30 ↔ 20 ↔ 10

# Delete from both ends (fast!)
dll.delete_at_head()  # [20 ↔ 30 ↔ 40]
dll.delete_at_tail()  # [20 ↔ 30]
print(dll)
```

## Comparison with Arrays

| Feature | Linked List | Array |
|---------|------------|-------|
| **Memory layout** | Scattered, nodes anywhere in memory | Contiguous block |
| **Access by index** | O(n) - must traverse | O(1) - direct calculation |
| **Insert at beginning** | O(1) - update head | O(n) - shift all elements |
| **Insert at end** | O(1) with tail pointer | O(1) amortized |
| **Insert in middle** | O(n) to find + O(1) to insert | O(n) to shift |
| **Delete at beginning** | O(1) - update head | O(n) - shift all elements |
| **Delete at end** | O(1) with tail (doubly) | O(1) |
| **Memory per element** | Higher (data + pointer(s)) | Lower (just data) |
| **Cache performance** | Poor (scattered memory) | Excellent (contiguous) |
| **Fixed size?** | No, grows dynamically | Static: Yes, Dynamic: No |

**When to use linked lists:**
- Frequent insertions/deletions at beginning
- Size unknown or highly variable
- Don't need random access by index
- Implementing queues or stacks

**When to use arrays:**
- Need fast access by index
- Size relatively stable
- Few insertions/deletions in middle
- Memory efficiency critical

## Key Properties

**Advantages:**
- **O(1) insertion/deletion at head:** No shifting required
- **No wasted capacity:** Only allocates memory for elements that exist
- **No resizing:** Grows naturally without expensive copy operations
- **Easy to implement queues/stacks:** Natural fit for these structures

**Disadvantages:**
- **O(n) access by index:** Must traverse from head
- **Higher memory overhead:** Each node needs pointer(s)
- **Poor cache locality:** Nodes scattered in memory hurt performance
- **More complex:** Pointer manipulation error-prone

## Common Pitfalls

**Losing references (memory leak):**

```python
# Wrong! Loses reference to rest of list
head = Node(10)
head.next = Node(20)
head = Node(5)  # Lost nodes 10 and 20!
```

**Null pointer errors:**

```python
# Dangerous! What if current is None?
current = current.next
print(current.data)  # AttributeError if current is None

# Safe approach
if current is not None:
    current = current.next
```

**Off-by-one in traversal:**

```python
# Wrong! Skips the first node
current = head.next  # Started at second node instead of head
```

**Circular reference in deletion:**

```python
# Wrong! Creates a cycle
node.next = node  # Node points to itself

# Correct deletion
node.next = node.next.next  # Skip over node to delete
```

**Modifying list while iterating:**

```python
# Dangerous! Can skip nodes or lose references
current = head
while current is not None:
    # Be careful about modifying current.next here
    current = current.next
```

## Advanced Operations

### Reversing a Linked List

```python
def reverse(head):
    """Reverse a singly linked list - O(n)"""
    prev = None
    current = head

    while current is not None:
        next_node = current.next  # Save next
        current.next = prev       # Reverse pointer
        prev = current            # Move prev forward
        current = next_node       # Move current forward

    return prev  # New head

# Example: [1 → 2 → 3] becomes [3 → 2 → 1]
```

### Detecting a Cycle (Floyd's Algorithm)

```python
def has_cycle(head):
    """Detect if list has a cycle - O(n) time, O(1) space"""
    if not head:
        return False

    slow = fast = head

    while fast and fast.next:
        slow = slow.next         # Move one step
        fast = fast.next.next    # Move two steps

        if slow == fast:         # They met - cycle exists
            return True

    return False  # Fast reached end - no cycle
```

### Finding Middle Element

```python
def find_middle(head):
    """Find middle node - O(n) time, O(1) space"""
    if not head:
        return None

    slow = fast = head

    while fast and fast.next:
        slow = slow.next         # Move one step
        fast = fast.next.next    # Move two steps

    return slow  # Slow is at middle when fast reaches end
```

## When to Use

**Use linked lists when:**
- Frequently inserting or deleting at the beginning
- Size changes unpredictably
- Implementing queues, stacks, or graphs
- Memory fragmentation is acceptable
- You rarely need random access

**Don't use linked lists when:**
- Need fast access by index (use [[Arrays]])
- Memory overhead matters (pointers add up)
- Cache performance critical (linked lists scatter data)
- Need to frequently search for elements (use [[Hash Tables]] or [[Binary Search Trees]])

**Real-world uses:**
- **Operating systems:** Process scheduling queues
- **Browsers:** Back/forward navigation (doubly linked)
- **Music players:** Playlist with next/previous (doubly linked or circular)
- **Undo functionality:** Stack of actions (singly linked)
- **Graph representations:** Adjacency lists

## See Also

- [[Arrays]]
- [[Stacks]]
- [[Queues]]
- [[Trees]]
- [[Hash Tables]]
- [[Big O Notation]]
- [[Pointers and References]]
- [[Memory Management]]

## References

- Introduction to Algorithms (CLRS), Chapter 10.2
- The Art of Computer Programming, Volume 1 (Knuth), Section 2.2
- [Linked List on Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
- Data Structures and Algorithm Analysis in C (Weiss), Chapter 3
