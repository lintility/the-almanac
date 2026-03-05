---
title: Hash Tables
chapter: computer-science
type: data-structure
difficulty: intermediate
prerequisites:
  - "[[Arrays]]"
  - "[[Linked Lists]]"
  - "[[Big O Notation]]"
related:
  - "[[Hash Functions]]"
  - "[[Sets]]"
  - "[[Dictionaries]]"
  - "[[Caching]]"
tags:
  - data-structures
  - hash-tables
  - hash-maps
  - dictionaries
  - hashing
status: draft
created: "2026-03-05"
updated: "2026-03-05"
author: Content Editor
---

# Hash Tables

## Overview

A hash table (also called hash map or dictionary) stores key-value pairs and provides extremely fast lookups, insertions, and deletions—typically O(1) on average. Think of it like a library's card catalog: instead of searching through every book, you use the catalog to jump directly to the right shelf.

Hash tables achieve this speed by using a **hash function** to convert keys into array indices. The key "apple" might hash to index 5, so you store the value at array position 5. Later, hashing "apple" again gives 5, so you can instantly retrieve the value.

This simple idea powers countless applications:
- **Databases:** Fast lookups by ID
- **Caches:** Web browsers, CDNs, CPU caches
- **Language features:** Python dicts, JavaScript objects, Java HashMaps
- **Algorithms:** Two-sum, frequency counting, deduplication

## Core Concept

A hash table has three key components:

1. **Array:** The underlying storage (buckets)
2. **Hash function:** Converts keys to array indices
3. **Collision resolution:** Handles when two keys hash to the same index

### How It Works

```
1. Hash the key to get an index:
   hash("apple") → 8329472... → mod 10 → index 2

2. Store value at that index:
   array[2] = ("apple", "red fruit")

3. Later, retrieve by hashing the key again:
   hash("apple") → index 2 → array[2] → "red fruit"
```

**Visual representation:**
```
Key: "apple"  →  hash("apple") = 2
Key: "banana" →  hash("banana") = 5
Key: "cherry" →  hash("cherry") = 8

Array (buckets):
  0: empty
  1: empty
  2: ("apple", "red fruit")     ← hash("apple") = 2
  3: empty
  4: empty
  5: ("banana", "yellow fruit")  ← hash("banana") = 5
  6: empty
  7: empty
  8: ("cherry", "red fruit")     ← hash("cherry") = 8
  9: empty
```

## Hash Functions

A hash function takes a key and produces an integer (the hash code). Good hash functions have these properties:

**Deterministic:** Same key always produces same hash
```python
hash("apple") == hash("apple")  # Always true
```

**Uniform distribution:** Spreads keys evenly across array
```python
# Bad: Everything hashes to same value
def bad_hash(key):
    return 0  # All keys collide!

# Good: Spreads keys across range
def good_hash(key):
    return sum(ord(c) for c in key) % capacity
```

**Fast to compute:** O(1) or O(k) where k is key size
```python
# Fast: O(k) where k = len(key)
hash_value = sum(ord(c) for c in key)

# Slow: O(2^k) - exponential!
hash_value = some_expensive_cryptographic_function(key)
```

### Simple Hash Function Example

```python
def simple_hash(key, capacity):
    """Hash a string key to array index"""
    # Convert each character to number and sum
    hash_value = 0
    for char in key:
        hash_value += ord(char)  # ASCII value

    # Reduce to valid array index
    return hash_value % capacity

# Examples
capacity = 10
print(simple_hash("apple", capacity))   # 5
print(simple_hash("banana", capacity))  # 2
print(simple_hash("cherry", capacity))  # 4
```

### Better Hash Function (Polynomial Rolling Hash)

```python
def polynomial_hash(key, capacity):
    """Better hash function using prime number"""
    hash_value = 0
    prime = 31  # Common choice for string hashing

    for char in key:
        hash_value = hash_value * prime + ord(char)

    return hash_value % capacity

# This distributes keys more uniformly than simple sum
```

## Collisions and Resolution

**Collision:** When two different keys hash to the same index.

```python
hash("apple") → 2
hash("melon") → 2  # Collision!
```

No hash function can avoid all collisions (by the pigeonhole principle: infinite possible keys, finite array indices). So we need collision resolution strategies.

### Chaining (Separate Chaining)

Each array slot holds a linked list of all key-value pairs that hash to that index.

```
Array with chaining:
  0: empty
  1: empty
  2: [("apple", "red")] → [("melon", "green")] → null  ← Both hash to 2
  3: empty
  4: [("banana", "yellow")] → null
  ...
```

**Advantages:**
- Simple to implement
- Table never "fills up"
- Performance degrades gradually

**Disadvantages:**
- Extra memory for linked list pointers
- Poor cache locality (linked lists scattered in memory)

### Open Addressing (Linear Probing)

All key-value pairs stored directly in the array. On collision, probe (search) for the next empty slot.

```
Insert "apple" → hash to 2 → array[2] = ("apple", "red")
Insert "melon" → hash to 2 → slot occupied → try 3 → array[3] = ("melon", "green")

Array with open addressing:
  0: empty
  1: empty
  2: ("apple", "red")
  3: ("melon", "green")   ← Probed to next slot after collision
  4: empty
  ...
```

**Search with linear probing:**
1. Hash key to get index
2. Check if key matches
3. If not, try next slot (wrap around if needed)
4. Stop when you find the key or hit an empty slot

**Advantages:**
- Better cache locality (contiguous array)
- No extra memory for pointers
- Fast when load factor is low

**Disadvantages:**
- **Primary clustering:** Consecutive occupied slots form clusters, slowing down operations
- Table can fill up
- Deletion is tricky (need tombstones)

## Time Complexity

| Operation | Average Case | Worst Case |
|-----------|--------------|------------|
| Search | O(1) | O(n) |
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |

**Average case:** With good hash function and low load factor, operations are O(1).

**Worst case:** All keys hash to same index (or cluster), degrading to O(n) linear search.

**Space Complexity:** O(n) for n key-value pairs

## Load Factor and Resizing

**Load factor** = number of elements / capacity

```python
hash_table with 7 elements, capacity 10:
load_factor = 7 / 10 = 0.7 (70%)
```

**Why it matters:**
- Low load factor (< 0.7): Fast operations, wasted space
- High load factor (> 0.7): More collisions, slower operations

**Resizing strategy:**
1. When load factor exceeds threshold (typically 0.7-0.75)
2. Create new array with ~2x capacity
3. Rehash all existing keys (hash values change with new capacity!)
4. Insert into new array

```python
# Before resize: capacity=10, 8 elements
hash("apple") % 10 = 5

# After resize: capacity=20, same 8 elements
hash("apple") % 20 = 15  # Different index!
```

**Resizing cost:** O(n) to rehash all elements, but happens infrequently. **Amortized O(1)** per insertion.

## Implementation: Hash Table with Chaining

```python
class HashNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None

class HashTable:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.size = 0
        self.buckets = [None] * capacity
        self.load_factor_threshold = 0.7

    def _hash(self, key):
        """Hash function using Python's built-in hash"""
        return hash(key) % self.capacity

    def put(self, key, value):
        """Insert or update key-value pair - O(1) average"""
        # Check if resize needed
        if self.size / self.capacity >= self.load_factor_threshold:
            self._resize()

        index = self._hash(key)
        node = self.buckets[index]

        # Check if key exists (update case)
        while node:
            if node.key == key:
                node.value = value  # Update existing
                return
            node = node.next

        # Insert new node at head of chain
        new_node = HashNode(key, value)
        new_node.next = self.buckets[index]
        self.buckets[index] = new_node
        self.size += 1

    def get(self, key):
        """Retrieve value by key - O(1) average"""
        index = self._hash(key)
        node = self.buckets[index]

        # Traverse chain looking for key
        while node:
            if node.key == key:
                return node.value
            node = node.next

        raise KeyError(f"Key '{key}' not found")

    def remove(self, key):
        """Delete key-value pair - O(1) average"""
        index = self._hash(key)
        node = self.buckets[index]
        prev = None

        while node:
            if node.key == key:
                # Remove node from chain
                if prev:
                    prev.next = node.next
                else:
                    # Removing head of chain
                    self.buckets[index] = node.next
                self.size -= 1
                return node.value
            prev = node
            node = node.next

        raise KeyError(f"Key '{key}' not found")

    def contains(self, key):
        """Check if key exists - O(1) average"""
        try:
            self.get(key)
            return True
        except KeyError:
            return False

    def _resize(self):
        """Double capacity and rehash all keys - O(n)"""
        old_buckets = self.buckets
        self.capacity *= 2
        self.buckets = [None] * self.capacity
        self.size = 0

        # Rehash all existing keys
        for bucket in old_buckets:
            node = bucket
            while node:
                self.put(node.key, node.value)
                node = node.next

    def __len__(self):
        return self.size

    def __str__(self):
        items = []
        for bucket in self.buckets:
            node = bucket
            while node:
                items.append(f"{node.key}: {node.value}")
                node = node.next
        return "{" + ", ".join(items) + "}"

# Usage
hash_table = HashTable(capacity=5)

# Insert key-value pairs
hash_table.put("apple", "red")
hash_table.put("banana", "yellow")
hash_table.put("cherry", "red")
hash_table.put("date", "brown")

print(hash_table)  # {apple: red, banana: yellow, cherry: red, date: brown}

# Retrieve values
print(hash_table.get("banana"))  # yellow

# Update value
hash_table.put("banana", "green")  # Update
print(hash_table.get("banana"))    # green

# Check existence
print(hash_table.contains("cherry"))  # True
print(hash_table.contains("grape"))   # False

# Delete
hash_table.remove("cherry")
print(hash_table.contains("cherry"))  # False

# Automatic resizing when load factor exceeds threshold
for i in range(10):
    hash_table.put(f"key{i}", f"value{i}")
# Capacity automatically doubled during insertions
```

## Implementation: Hash Table with Open Addressing

```python
class OpenAddressHashTable:
    class Entry:
        def __init__(self, key, value):
            self.key = key
            self.value = value

    # Special marker for deleted entries
    DELETED = object()

    def __init__(self, capacity=10):
        self.capacity = capacity
        self.size = 0
        self.table = [None] * capacity
        self.load_factor_threshold = 0.5  # Lower for open addressing

    def _hash(self, key):
        return hash(key) % self.capacity

    def put(self, key, value):
        """Insert or update key-value pair - O(1) average"""
        if self.size / self.capacity >= self.load_factor_threshold:
            self._resize()

        index = self._find_slot(key)

        if self.table[index] is None or self.table[index] is self.DELETED:
            # Insert new entry
            self.table[index] = self.Entry(key, value)
            self.size += 1
        else:
            # Update existing entry
            self.table[index].value = value

    def get(self, key):
        """Retrieve value by key - O(1) average"""
        index = self._find_slot(key)

        if self.table[index] is None:
            raise KeyError(f"Key '{key}' not found")

        if self.table[index] is self.DELETED:
            raise KeyError(f"Key '{key}' not found")

        if self.table[index].key == key:
            return self.table[index].value

        raise KeyError(f"Key '{key}' not found")

    def remove(self, key):
        """Delete key-value pair - O(1) average"""
        index = self._find_slot(key)

        if (self.table[index] is None or
            self.table[index] is self.DELETED or
            self.table[index].key != key):
            raise KeyError(f"Key '{key}' not found")

        # Mark as deleted (tombstone)
        value = self.table[index].value
        self.table[index] = self.DELETED
        self.size -= 1
        return value

    def _find_slot(self, key):
        """Linear probing to find slot for key"""
        index = self._hash(key)
        start_index = index

        while True:
            # Empty slot or matching key
            if (self.table[index] is None or
                (self.table[index] is not self.DELETED and
                 self.table[index].key == key)):
                return index

            # Deleted slot - can insert here but keep probing for search
            if self.table[index] is self.DELETED:
                deleted_index = index
                # Keep probing to see if key exists further
                index = (index + 1) % self.capacity
                while self.table[index] is not None:
                    if (self.table[index] is not self.DELETED and
                        self.table[index].key == key):
                        return index
                    index = (index + 1) % self.capacity
                return deleted_index

            # Probe next slot
            index = (index + 1) % self.capacity

            # Full cycle - table is full
            if index == start_index:
                raise Exception("Hash table is full")

    def _resize(self):
        """Double capacity and rehash - O(n)"""
        old_table = self.table
        self.capacity *= 2
        self.table = [None] * self.capacity
        self.size = 0

        for entry in old_table:
            if entry is not None and entry is not self.DELETED:
                self.put(entry.key, entry.value)

# Usage similar to chaining version
hash_table = OpenAddressHashTable()
hash_table.put("apple", "red")
hash_table.put("banana", "yellow")
print(hash_table.get("apple"))  # red
```

## Real-World Examples

### Frequency Counter

```python
def count_frequencies(words):
    """Count word frequencies using hash table"""
    freq = {}  # Python dict is a hash table

    for word in words:
        if word in freq:
            freq[word] += 1
        else:
            freq[word] = 1

    return freq

# Or more pythonic
from collections import defaultdict
def count_frequencies_v2(words):
    freq = defaultdict(int)
    for word in words:
        freq[word] += 1
    return freq

text = ["apple", "banana", "apple", "cherry", "banana", "apple"]
print(count_frequencies(text))
# {'apple': 3, 'banana': 2, 'cherry': 1}
```

### Two Sum Problem

```python
def two_sum(nums, target):
    """Find two numbers that add up to target - O(n)"""
    seen = {}  # Hash table: value → index

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return None

# Without hash table would be O(n²) with nested loops
nums = [2, 7, 11, 15]
print(two_sum(nums, 9))  # [0, 1] (2 + 7 = 9)
```

### Caching (Memoization)

```python
def fibonacci_memo():
    """Fibonacci with memoization using hash table"""
    cache = {}

    def fib(n):
        if n in cache:
            return cache[n]  # O(1) lookup

        if n <= 1:
            return n

        result = fib(n - 1) + fib(n - 2)
        cache[n] = result
        return result

    return fib

fib = fibonacci_memo()
print(fib(100))  # Fast! Without cache, would take forever
```

### Deduplication

```python
def remove_duplicates(items):
    """Remove duplicates while preserving order - O(n)"""
    seen = {}
    result = []

    for item in items:
        if item not in seen:
            seen[item] = True
            result.append(item)

    return result

# Or using set (which is also a hash table)
def remove_duplicates_v2(items):
    return list(dict.fromkeys(items))

data = [1, 2, 3, 2, 4, 1, 5]
print(remove_duplicates(data))  # [1, 2, 3, 4, 5]
```

### Group Anagrams

```python
def group_anagrams(words):
    """Group words that are anagrams - O(n*k) where k=avg word length"""
    groups = {}

    for word in words:
        # Use sorted word as key (anagrams have same sorted form)
        key = ''.join(sorted(word))

        if key not in groups:
            groups[key] = []

        groups[key].append(word)

    return list(groups.values())

words = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(words))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
```

## Key Properties

**Advantages:**
- **Very fast:** O(1) average-case for search, insert, delete
- **Flexible keys:** Can use strings, numbers, tuples (any hashable type)
- **Natural fit:** Modeling associations (username → user data)
- **Common:** Built into most languages (dict, HashMap, Map, etc.)

**Disadvantages:**
- **No ordering:** Can't iterate in sorted order (use TreeMap/sorted keys)
- **Worst case O(n):** Poor hash function or high load factor
- **Extra space:** Load factor < 1 means wasted array slots
- **Hash function required:** Keys must be hashable (immutable)

## Common Pitfalls

### Using Mutable Keys

```python
# Wrong! Lists are mutable and can't be hashed
hash_table = {}
key = [1, 2, 3]
hash_table[key] = "value"  # TypeError: unhashable type: 'list'

# Correct: Use immutable types (tuples)
key = (1, 2, 3)
hash_table[key] = "value"  # Works!
```

### Assuming Iteration Order

```python
# Don't rely on iteration order (varies by implementation)
hash_table = {"apple": 1, "banana": 2, "cherry": 3}

# Python 3.7+ maintains insertion order, but this isn't universal
for key in hash_table:
    print(key)  # Order might not be what you expect

# For sorted iteration, explicitly sort
for key in sorted(hash_table.keys()):
    print(key)  # Always alphabetical
```

### Modifying Keys After Insertion

```python
# Dangerous! Don't modify mutable objects used as keys
class Person:
    def __init__(self, name):
        self.name = name

    def __hash__(self):
        return hash(self.name)

person = Person("Alice")
hash_table = {person: "data"}

# Bad: Modifying key after insertion
person.name = "Bob"  # Now hash changed!
print(hash_table[person])  # Might not find it! Hash changed.

# Use immutable attributes for hashing or make objects immutable
```

### Ignoring Load Factor

```python
# Bad: Never resize, performance degrades
class BadHashTable:
    def __init__(self):
        self.table = [None] * 10  # Fixed size

    def put(self, key, value):
        # No resizing! As table fills, collisions increase
        # O(1) becomes O(n)
        pass

# Always implement resizing based on load factor
```

### Confusing Hash Tables with Arrays

```python
# Hash table: Fast lookup by key, no order
user_data = {"alice": {"age": 25}, "bob": {"age": 30}}
print(user_data["alice"])  # O(1)

# Array: Fast lookup by index, maintains order
users = [{"name": "alice", "age": 25}, {"name": "bob", "age": 30}]
print(users[0])  # O(1) by index
# But finding "alice" requires O(n) search

# Use hash table when you have natural keys
# Use array when you need ordered sequence
```

## When to Use

**Use hash tables when:**
- Need fast lookups by key (not position)
- Counting frequencies or grouping items
- Checking for duplicates or set membership
- Caching/memoization
- Implementing dictionaries, sets, or databases

**Don't use hash tables when:**
- Need sorted/ordered iteration (use [[Trees]] or sort first)
- Keys are sequential integers 0..n (use [[Arrays]])
- Need to find min/max efficiently (use [[Heaps]])
- Memory is extremely constrained (array overhead from load factor)

## Hash Table Variants

### Set

Hash table that stores only keys (no values), for membership testing.

```python
seen = set()
seen.add("apple")
print("apple" in seen)  # O(1)
```

### Multimap

Hash table where each key can map to multiple values.

```python
from collections import defaultdict

multimap = defaultdict(list)
multimap["fruit"].append("apple")
multimap["fruit"].append("banana")
print(multimap["fruit"])  # ['apple', 'banana']
```

### LRU Cache

Hash table + doubly linked list for O(1) cache eviction.

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)  # Mark as recently used
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)  # Remove oldest
```

## See Also

- [[Arrays]]
- [[Linked Lists]]
- [[Hash Functions]]
- [[Sets]]
- [[Trees]]
- [[Big O Notation]]
- [[Caching]]

## References

- Introduction to Algorithms (CLRS), Chapter 11
- The Art of Computer Programming, Volume 3 (Knuth), Section 6.4
- [Python dict Implementation](https://github.com/python/cpython/blob/main/Objects/dictobject.c)
- [Java HashMap Documentation](https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html)
- "Hash Functions and Hash Tables" - Computer Science: An Overview (Brookshear)
