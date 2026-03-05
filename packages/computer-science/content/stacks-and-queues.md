---
title: Stacks and Queues
chapter: computer-science
type: data-structure
difficulty: beginner
prerequisites:
  - "[[Arrays]]"
  - "[[Linked Lists]]"
related:
  - "[[Trees]]"
  - "[[Breadth-First Search]]"
  - "[[Depth-First Search]]"
  - "[[Recursion]]"
  - "[[Big O Notation]]"
tags:
  - data-structures
  - stacks
  - queues
  - lifo
  - fifo
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Stacks and Queues

## Overview

Stacks and queues are fundamental data structures that control the order in which elements are accessed. Think of a stack like a pile of plates—you can only add or remove from the top. Think of a queue like a line at a coffee shop—first person in line is first to be served.

These simple concepts power critical computing operations:
- **Stacks:** Function calls, undo/redo, expression evaluation, backtracking
- **Queues:** Task scheduling, message passing, breadth-first search, buffering

Both structures restrict access compared to arrays or linked lists. This constraint is their strength: by limiting how you interact with data, they make certain algorithms simpler and more efficient.

## Core Concept

### Stack: Last-In, First-Out (LIFO)

A stack follows LIFO ordering: the most recently added element is the first one removed.

```
push(1)  →  [1]
push(2)  →  [1, 2]
push(3)  →  [1, 2, 3]
pop()    ←  3  (returns and removes top element)
             [1, 2]
peek()   ←  2  (returns top without removing)
             [1, 2]
pop()    ←  2
             [1]
```

**Visual representation:**
```
      ← pop/peek/push
    ┌─────┐
    │  3  │  ← top
    ├─────┤
    │  2  │
    ├─────┤
    │  1  │  ← bottom
    └─────┘
```

### Queue: First-In, First-Out (FIFO)

A queue follows FIFO ordering: the oldest element is removed first.

```
enqueue(1)  →  [1]
enqueue(2)  →  [1, 2]
enqueue(3)  →  [1, 2, 3]
dequeue()   ←  1  (returns and removes front element)
                [2, 3]
peek()      ←  2  (returns front without removing)
                [2, 3]
dequeue()   ←  2
                [3]
```

**Visual representation:**
```
front ← dequeue/peek              enqueue →
    ┌─────┬─────┬─────┐
    │  1  │  2  │  3  │
    └─────┴─────┴─────┘
```

## Stack Operations

| Operation | Description | Time Complexity |
|-----------|-------------|----------------|
| **push(item)** | Add item to top | O(1) |
| **pop()** | Remove and return top item | O(1) |
| **peek()** / **top()** | Return top item without removing | O(1) |
| **is_empty()** | Check if stack is empty | O(1) |
| **size()** | Return number of elements | O(1) |

**Space Complexity:** O(n) for n elements

## Queue Operations

| Operation | Description | Time Complexity |
|-----------|-------------|----------------|
| **enqueue(item)** / **push()** | Add item to rear | O(1) |
| **dequeue()** / **pop()** | Remove and return front item | O(1) |
| **peek()** / **front()** | Return front item without removing | O(1) |
| **is_empty()** | Check if queue is empty | O(1) |
| **size()** | Return number of elements | O(1) |

**Space Complexity:** O(n) for n elements

## Stack Implementation: Array-Based

```python
class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        """Add item to top - O(1)"""
        self.items.append(item)

    def pop(self):
        """Remove and return top item - O(1)"""
        if self.is_empty():
            raise IndexError("Pop from empty stack")
        return self.items.pop()

    def peek(self):
        """Return top item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Peek from empty stack")
        return self.items[-1]

    def is_empty(self):
        """Check if stack is empty - O(1)"""
        return len(self.items) == 0

    def size(self):
        """Return number of elements - O(1)"""
        return len(self.items)

    def __str__(self):
        return f"Stack({self.items})"

# Usage
stack = Stack()

# Push elements
stack.push(10)  # [10]
stack.push(20)  # [10, 20]
stack.push(30)  # [10, 20, 30]
print(stack)    # Stack([10, 20, 30])

# Peek at top
print(stack.peek())  # 30 (doesn't remove)

# Pop elements (LIFO order)
print(stack.pop())   # 30
print(stack.pop())   # 20
print(stack.pop())   # 10

print(stack.is_empty())  # True
```

## Stack Implementation: Linked List-Based

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedStack:
    def __init__(self):
        self.top = None
        self.length = 0

    def push(self, item):
        """Add item to top - O(1)"""
        new_node = Node(item)
        new_node.next = self.top  # Point to current top
        self.top = new_node       # Update top
        self.length += 1

    def pop(self):
        """Remove and return top item - O(1)"""
        if self.is_empty():
            raise IndexError("Pop from empty stack")

        data = self.top.data
        self.top = self.top.next  # Move top to next node
        self.length -= 1
        return data

    def peek(self):
        """Return top item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Peek from empty stack")
        return self.top.data

    def is_empty(self):
        return self.top is None

    def size(self):
        return self.length

# Usage is identical to array-based stack
```

**Why use linked list implementation?**
- No resizing needed (array-based stacks may need to resize)
- Constant memory per operation
- Good when max size is unknown

**Trade-off:**
- Higher memory overhead per element (pointer + data)
- Slightly slower due to pointer indirection

## Queue Implementation: Array-Based (Naive)

```python
class NaiveQueue:
    def __init__(self):
        self.items = []

    def enqueue(self, item):
        """Add item to rear - O(1)"""
        self.items.append(item)

    def dequeue(self):
        """Remove and return front item - O(n) [BAD!]"""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")
        # Removing first element shifts all others
        return self.items.pop(0)

    def is_empty(self):
        return len(self.items) == 0

# Problem: dequeue is O(n) because pop(0) shifts all elements
```

**This implementation has a fatal flaw:** `pop(0)` is O(n) because it shifts all remaining elements left. For a queue with 1 million elements, dequeue copies 999,999 elements!

## Queue Implementation: Circular Array

```python
class CircularQueue:
    def __init__(self, capacity=10):
        self.items = [None] * capacity
        self.front = 0
        self.rear = 0
        self.length = 0
        self.capacity = capacity

    def enqueue(self, item):
        """Add item to rear - O(1)"""
        if self.length == self.capacity:
            self._resize()

        self.items[self.rear] = item
        self.rear = (self.rear + 1) % self.capacity  # Wrap around
        self.length += 1

    def dequeue(self):
        """Remove and return front item - O(1)"""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")

        item = self.items[self.front]
        self.items[self.front] = None  # Help garbage collection
        self.front = (self.front + 1) % self.capacity  # Wrap around
        self.length -= 1
        return item

    def peek(self):
        """Return front item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Peek from empty queue")
        return self.items[self.front]

    def is_empty(self):
        return self.length == 0

    def size(self):
        return self.length

    def _resize(self):
        """Double capacity when full - O(n)"""
        new_capacity = self.capacity * 2
        new_items = [None] * new_capacity

        # Copy elements in correct order
        for i in range(self.length):
            new_items[i] = self.items[(self.front + i) % self.capacity]

        self.items = new_items
        self.front = 0
        self.rear = self.length
        self.capacity = new_capacity

# Usage
queue = CircularQueue(capacity=5)

# Enqueue elements
for i in range(1, 6):
    queue.enqueue(i * 10)  # [10, 20, 30, 40, 50]

# Dequeue and enqueue (demonstrates wrapping)
print(queue.dequeue())  # 10
print(queue.dequeue())  # 20
queue.enqueue(60)       # [30, 40, 50, 60] (wraps around)
queue.enqueue(70)       # [30, 40, 50, 60, 70]

print(queue.peek())     # 30
```

**How circular array works:**
```
Initial state:
front=0, rear=0, capacity=5
[ _, _, _, _, _ ]
  ↑
  front/rear

After enqueue(10), enqueue(20), enqueue(30):
front=0, rear=3, length=3
[10, 20, 30, _, _]
 ↑          ↑
 front      rear

After dequeue(), dequeue():
front=2, rear=3, length=1
[_, _, 30, _, _]
       ↑   ↑
       front rear

After enqueue(40), enqueue(50), enqueue(60):
front=2, rear=0 (wrapped!), length=4
[60, _, 30, 40, 50]
 ↑      ↑
 rear   front
```

## Queue Implementation: Linked List-Based

```python
class QueueNode:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedQueue:
    def __init__(self):
        self.front = None
        self.rear = None
        self.length = 0

    def enqueue(self, item):
        """Add item to rear - O(1)"""
        new_node = QueueNode(item)

        if self.is_empty():
            # First element
            self.front = self.rear = new_node
        else:
            # Add to rear
            self.rear.next = new_node
            self.rear = new_node

        self.length += 1

    def dequeue(self):
        """Remove and return front item - O(1)"""
        if self.is_empty():
            raise IndexError("Dequeue from empty queue")

        data = self.front.data
        self.front = self.front.next

        # If queue becomes empty, update rear too
        if self.front is None:
            self.rear = None

        self.length -= 1
        return data

    def peek(self):
        """Return front item without removing - O(1)"""
        if self.is_empty():
            raise IndexError("Peek from empty queue")
        return self.front.data

    def is_empty(self):
        return self.front is None

    def size(self):
        return self.length

# Usage
queue = LinkedQueue()
queue.enqueue(10)  # [10]
queue.enqueue(20)  # [10, 20]
queue.enqueue(30)  # [10, 20, 30]

print(queue.dequeue())  # 10 (FIFO)
print(queue.dequeue())  # 20
print(queue.peek())     # 30 (still in queue)
```

**Advantages of linked list queue:**
- True O(1) enqueue and dequeue
- No resizing needed
- No wasted space from circular array

## Real-World Examples

### Stack: Function Call Stack

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# When you call factorial(3):
# Stack grows:
# factorial(3) → waiting for factorial(2)
#   factorial(2) → waiting for factorial(1)
#     factorial(1) → returns 1
#   factorial(2) → computes 2 * 1 = 2, returns
# factorial(3) → computes 3 * 2 = 6, returns

# The call stack ensures each function returns to its caller
```

### Stack: Undo/Redo

```python
class TextEditor:
    def __init__(self):
        self.text = ""
        self.undo_stack = Stack()
        self.redo_stack = Stack()

    def type(self, char):
        # Save current state for undo
        self.undo_stack.push(self.text)
        self.text += char
        # Clear redo stack on new action
        self.redo_stack = Stack()

    def undo(self):
        if not self.undo_stack.is_empty():
            # Save current state for redo
            self.redo_stack.push(self.text)
            # Restore previous state
            self.text = self.undo_stack.pop()

    def redo(self):
        if not self.redo_stack.is_empty():
            # Save current state for undo
            self.undo_stack.push(self.text)
            # Restore redone state
            self.text = self.redo_stack.pop()

# Usage
editor = TextEditor()
editor.type("H")       # "H"
editor.type("i")       # "Hi"
editor.undo()          # "H"
editor.undo()          # ""
editor.redo()          # "H"
editor.redo()          # "Hi"
```

### Stack: Expression Evaluation

```python
def evaluate_postfix(expression):
    """Evaluate postfix expression (e.g., '3 4 + 2 *')"""
    stack = Stack()

    for token in expression.split():
        if token.isdigit():
            stack.push(int(token))
        else:
            # Operator: pop two operands
            b = stack.pop()
            a = stack.pop()

            if token == '+':
                stack.push(a + b)
            elif token == '-':
                stack.push(a - b)
            elif token == '*':
                stack.push(a * b)
            elif token == '/':
                stack.push(a / b)

    return stack.pop()

# "3 4 + 2 *" means (3 + 4) * 2
print(evaluate_postfix("3 4 + 2 *"))  # 14

# Stack trace:
# [3]
# [3, 4]
# [7]         (popped 3,4, pushed 3+4)
# [7, 2]
# [14]        (popped 7,2, pushed 7*2)
```

### Queue: Task Scheduling

```python
class TaskScheduler:
    def __init__(self):
        self.queue = LinkedQueue()

    def add_task(self, task):
        """Add task to end of queue"""
        self.queue.enqueue(task)
        print(f"Added task: {task}")

    def process_next(self):
        """Process first task in queue"""
        if not self.queue.is_empty():
            task = self.queue.dequeue()
            print(f"Processing task: {task}")
            return task
        print("No tasks to process")
        return None

# Usage
scheduler = TaskScheduler()
scheduler.add_task("Send email")
scheduler.add_task("Generate report")
scheduler.add_task("Backup data")

# Process in FIFO order
scheduler.process_next()  # Send email
scheduler.process_next()  # Generate report
scheduler.process_next()  # Backup data
```

### Queue: Breadth-First Search (BFS)

```python
def bfs_tree(root):
    """Visit tree nodes level by level using queue"""
    if not root:
        return

    queue = LinkedQueue()
    queue.enqueue(root)

    while not queue.is_empty():
        node = queue.dequeue()
        print(node.value)  # Process node

        # Add children to queue
        if node.left:
            queue.enqueue(node.left)
        if node.right:
            queue.enqueue(node.right)

# Visits nodes level by level:
#       1
#      / \
#     2   3
#    / \
#   4   5
# Output: 1, 2, 3, 4, 5 (level order)
```

## Comparison: Stack vs Queue vs Array vs Linked List

| Feature | Stack | Queue | Array | Linked List |
|---------|-------|-------|-------|-------------|
| **Access pattern** | LIFO | FIFO | Random | Sequential |
| **Add element** | O(1) push | O(1) enqueue | O(1) append | O(1) at head |
| **Remove element** | O(1) pop | O(1) dequeue | O(1) from end | O(1) at head |
| **Access by index** | Not supported | Not supported | O(1) | O(n) |
| **Peek first/top** | O(1) | O(1) | O(1) | O(1) |
| **Use case** | Function calls, undo, DFS | Scheduling, buffers, BFS | Random access | Insertions |

## Key Properties

### Stack Advantages
- Simple LIFO semantics match many algorithms
- Natural fit for recursion, backtracking, parsing
- Efficient implementations (array or linked list)
- All operations O(1)

### Stack Disadvantages
- No random access
- Can't access elements except top
- Limited use cases compared to general-purpose structures

### Queue Advantages
- Fair FIFO ordering (first come, first served)
- Essential for BFS, buffering, scheduling
- All operations O(1) with proper implementation
- Models real-world waiting lines

### Queue Disadvantages
- More complex to implement efficiently (circular array)
- No random access
- Naive array implementation has O(n) dequeue

## Common Pitfalls

### Stack: Popping from empty stack

```python
stack = Stack()
stack.pop()  # IndexError!

# Always check first
if not stack.is_empty():
    value = stack.pop()
```

### Stack: Forgetting to return value

```python
# Wrong: modifies stack but loses value
def process_stack(stack):
    stack.pop()  # Value is lost!

# Correct: use the popped value
def process_stack(stack):
    if not stack.is_empty():
        value = stack.pop()
        print(f"Processed: {value}")
```

### Queue: Using list.pop(0) for dequeue

```python
# WRONG - O(n) dequeue!
class BadQueue:
    def __init__(self):
        self.items = []

    def dequeue(self):
        return self.items.pop(0)  # Shifts all elements!

# Use collections.deque or circular array instead
from collections import deque
queue = deque()
queue.append(1)      # enqueue
queue.popleft()      # dequeue in O(1)
```

### Queue: Circular array index bugs

```python
# Wrong: forgetting modulo wrapping
def enqueue(self, item):
    self.rear += 1  # Can exceed capacity!
    self.items[self.rear] = item

# Correct: wrap around with modulo
def enqueue(self, item):
    self.rear = (self.rear + 1) % self.capacity
    self.items[self.rear] = item
```

## When to Use

### Use Stack when:
- Need LIFO ordering
- Implementing recursion iteratively
- Backtracking algorithms (maze solving, game trees)
- Parsing/evaluating expressions
- Undo/redo functionality
- Depth-first search

### Use Queue when:
- Need FIFO ordering (fair scheduling)
- Breadth-first search
- Task scheduling, job queues
- Buffering (keyboard input, print queue)
- Asynchronous data transfer
- Handling requests in order received

### Don't use Stack/Queue when:
- Need random access by index (use [[Arrays]])
- Need to search for elements (use [[Hash Tables]])
- Need to access middle elements frequently (use [[Arrays]] or [[Linked Lists]])

## Variants

### Deque (Double-Ended Queue)

A deque allows insertion and removal from both ends.

```python
from collections import deque

dq = deque()

# Can act as stack or queue
dq.append(1)      # Add to right
dq.appendleft(2)  # Add to left
dq.pop()          # Remove from right
dq.popleft()      # Remove from left

# All operations are O(1)
```

### Priority Queue

Elements have priorities; highest priority dequeued first.

```python
import heapq

# Min-heap based priority queue
pq = []
heapq.heappush(pq, (2, "task B"))  # (priority, value)
heapq.heappush(pq, (1, "task A"))
heapq.heappush(pq, (3, "task C"))

# Dequeue in priority order
print(heapq.heappop(pq))  # (1, "task A")
print(heapq.heappop(pq))  # (2, "task B")
print(heapq.heappop(pq))  # (3, "task C")
```

## See Also

- [[Arrays]]
- [[Linked Lists]]
- [[Heaps]]
- [[Breadth-First Search]]
- [[Depth-First Search]]
- [[Recursion]]
- [[Trees]]
- [[Big O Notation]]

## References

- Introduction to Algorithms (CLRS), Chapter 10.1
- The Art of Computer Programming, Volume 1 (Knuth), Section 2.2.1
- [Python collections.deque](https://docs.python.org/3/library/collections.html#collections.deque)
- Data Structures and Algorithm Analysis in C (Weiss), Chapter 3
