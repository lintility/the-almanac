---
title: Hash Functions
chapter: cryptography
type: concept
difficulty: beginner
prerequisites:
  - "[[Binary Representation]]"
related:
  - "[[Digital Signatures]]"
  - "[[Password Security]]"
  - "[[Message Authentication Codes]]"
  - "[[Blockchain]]"
tags:
  - cryptography
  - hashing
  - integrity
  - fingerprinting
status: published
created: "2026-02-16"
updated: "2026-02-16"
author: Almanac Bot
---

# Hash Functions

## Overview

A hash function takes an input of any size and produces a fixed-size output (called a hash, digest, or fingerprint). It's like a one-way compression machine—you can turn any file into a unique 256-bit fingerprint, but you can't reverse that fingerprint back to the original file.

Think of it like this: if you give me the same book twice, I'll give you the same ISBN both times (deterministic). But if you give me just an ISBN, I can't reconstruct the book (one-way). And it's virtually impossible for two different books to accidentally get the same ISBN (collision resistance).

## Core Concept

A cryptographic hash function has five critical properties:

### 1. Deterministic
**Same input always produces the same output.**

```
SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

Every time, forever. This is what makes hashes useful for integrity checking.

### 2. Fixed Output Size
**No matter how big the input, the output is always the same size.**

```
SHA-256("hi") = 256 bits
SHA-256(entire_linux_kernel.tar.gz) = 256 bits
```

SHA-256 always produces exactly 256 bits (64 hex characters). SHA-512 always produces 512 bits. This predictability is crucial for storage and comparison.

### 3. One-Way (Preimage Resistance)
**You can't reverse a hash back to the original input.**

```
hash("password123") = abc123...def
# Given abc123...def, you CANNOT compute the original "password123"
```

This is fundamentally different from encryption. Encryption is reversible with the key; hashing is mathematically irreversible. The only way to "crack" a hash is to guess inputs until you find one that produces the same output (brute force).

### 4. Avalanche Effect
**Tiny change in input = completely different output.**

```
SHA-256("hello")  = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
SHA-256("Hello")  = 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
                     ^^^ Every bit changed
```

Changing one letter (h → H) flips approximately 50% of the output bits. This prevents pattern analysis—you can't deduce anything about the input from the output.

### 5. Collision Resistance
**It should be computationally infeasible to find two different inputs with the same hash.**

A collision is when `hash(A) == hash(B)` but `A ≠ B`. Good hash functions make collisions so hard to find that it's not worth trying.

```
# Bad (MD5 is broken):
hash("doc1.pdf") = abc123
hash("malware.pdf") = abc123  ← COLLISION! Attacker can swap files

# Good (SHA-256):
Finding a collision requires ~2^128 operations (billions of years on current hardware)
```

## Common Hash Algorithms

### SHA-256 (SHA-2 Family)
**The current industry standard.**

- Output: 256 bits (64 hex chars)
- Published: 2001 by NSA/NIST
- Security: No practical attacks known
- Speed: ~300 MB/s (single-threaded on modern CPUs)
- Use cases: Bitcoin mining, TLS certificates, file integrity, Git commits

**Variants:**
- SHA-224 (224 bits, truncated SHA-256)
- SHA-384 (384 bits, truncated SHA-512)
- SHA-512 (512 bits, twice as wide)

**When to use:** Default choice for almost everything.

### SHA-3 (Keccak)
**The newest NIST standard (2015).**

- Output: 224, 256, 384, or 512 bits (configurable)
- Based on sponge construction (different design than SHA-2)
- Security: Resistant to length extension attacks (SHA-2 is not)
- Speed: Slower than SHA-2 (~250 MB/s)
- Use cases: Future-proofing, regulatory compliance, applications vulnerable to length extension

**When to use:**
- You need length extension attack resistance
- You want algorithmic diversity (don't want all eggs in SHA-2 basket)
- Compliance requires it

**When NOT to use:** Performance-critical applications (SHA-2 is faster).

### BLAKE2 / BLAKE3
**The speed demons.**

- Output: Configurable (up to 512 bits for BLAKE2, 256 bits for BLAKE3)
- Speed: BLAKE2 is 2-3x faster than SHA-2; BLAKE3 is 10-20x faster (multi-threaded)
- Security: Strong (finalist in SHA-3 competition)
- Use cases: File checksums, deduplication, Merkle trees, password hashing (BLAKE2)

**Performance comparison (single-threaded, MB/s):**
```
SHA-256:  300 MB/s
SHA-3:    250 MB/s
BLAKE2b:  900 MB/s
BLAKE3:  3000 MB/s (single-thread), 15000 MB/s (multi-thread!)
```

**When to use:**
- Need maximum performance
- Verifying large files
- High-throughput applications

**When NOT to use:** Regulatory environments that mandate SHA-2/SHA-3.

### MD5
**⚠️ BROKEN. DO NOT USE FOR SECURITY.**

- Output: 128 bits
- Status: Collision attacks are trivial (can generate collisions in seconds on a laptop)
- Use case: **Non-security checksums only** (verifying file integrity against accidental corruption, not malicious tampering)

**Example MD5 collision (2004):**
Two completely different files can be crafted with the same MD5 hash. Attackers can swap a legitimate file with malware and the hash won't detect it.

**Only acceptable use:** Legacy systems, non-security checksums (e.g., checking if a file transferred correctly).

### SHA-1
**⚠️ DEPRECATED. AVOID.**

- Output: 160 bits
- Status: Collision attacks are practical (Google's SHAttered attack, 2017)
- Use case: **Legacy systems only** (Git still uses it, but is migrating to SHA-256)

**SHAttered attack (2017):**
Researchers created two different PDFs with the same SHA-1 hash. This proves SHA-1 is no longer suitable for security applications.

**Migration deadline:** Most browsers and CAs stopped accepting SHA-1 certificates in 2017.

## Hash Functions vs. Password Hashing

**Critical distinction: Fast hashes (SHA-256) are NOT suitable for passwords.**

### Cryptographic Hashing (Fast)
**Purpose:** Integrity checking, digital signatures, data deduplication  
**Examples:** SHA-256, SHA-3, BLAKE3  
**Speed:** Millions of hashes per second (by design)

```python
import hashlib
hashlib.sha256(b"password").hexdigest()
# Computes in microseconds
```

**Problem for passwords:** Attacker can try billions of passwords per second.

### Password Hashing (Intentionally Slow)
**Purpose:** Storing user passwords securely  
**Examples:** bcrypt, argon2, scrypt  
**Speed:** 10-1000 hashes per second (intentionally slow)

```python
import bcrypt
bcrypt.hashpw(b"password", bcrypt.gensalt(rounds=12))
# Takes ~250ms (configurable)
```

**Why slow is good:** Attacker trying 1 billion passwords takes 3 years instead of 1 second.

### Comparison Table

| Algorithm | Purpose | Speed | Suitable for Passwords? |
|-----------|---------|-------|------------------------|
| SHA-256 | Integrity, signatures | ~10M hashes/sec | ❌ NO |
| BLAKE3 | High-speed integrity | ~100M hashes/sec | ❌ NO |
| bcrypt | Password storage | ~10 hashes/sec | ✅ YES |
| argon2 | Password storage | ~1-100 hashes/sec | ✅ YES (best) |
| scrypt | Password storage | ~10-100 hashes/sec | ✅ YES |

**Golden rule:** Never use SHA-256 (or any fast hash) to store passwords. Use bcrypt or argon2.

## Implementation Examples

### File Integrity Verification (SHA-256)

```python
import hashlib

def hash_file(filepath):
    """Compute SHA-256 hash of a file."""
    sha256 = hashlib.sha256()
    
    with open(filepath, 'rb') as f:
        # Read file in chunks (memory-efficient for large files)
        for chunk in iter(lambda: f.read(4096), b''):
            sha256.update(chunk)
    
    return sha256.hexdigest()

# Usage
file_hash = hash_file("document.pdf")
print(f"SHA-256: {file_hash}")

# Verify integrity later
if hash_file("document.pdf") == file_hash:
    print("File is intact")
else:
    print("File has been modified or corrupted")
```

### Hashing Strings (Multiple Algorithms)

```python
import hashlib

data = b"hello world"

# SHA-256
print("SHA-256:", hashlib.sha256(data).hexdigest())

# SHA-3-256
print("SHA3-256:", hashlib.sha3_256(data).hexdigest())

# SHA-512
print("SHA-512:", hashlib.sha512(data).hexdigest())

# BLAKE2b (Python 3.6+)
print("BLAKE2b:", hashlib.blake2b(data).hexdigest())
```

### Password Hashing (bcrypt)

```python
import bcrypt

# Registration: Hash password
password = b"user_password_123"
salt = bcrypt.gensalt(rounds=12)  # Cost factor (higher = slower, more secure)
hashed = bcrypt.hashpw(password, salt)

# Store 'hashed' in database (includes salt automatically)

# Login: Verify password
submitted_password = b"user_password_123"
if bcrypt.checkpw(submitted_password, hashed):
    print("Password correct")
else:
    print("Password incorrect")
```

**Why bcrypt over SHA-256 for passwords:**
- Built-in salt generation
- Configurable work factor (can increase as hardware improves)
- Intentionally slow (prevents brute force)
- Constant-time comparison (prevents timing attacks)

### Merkle Tree (Git-Style)

```python
import hashlib

def hash_sha256(data):
    return hashlib.sha256(data.encode()).hexdigest()

# Leaf nodes (files)
file1_hash = hash_sha256("contents of file1.txt")
file2_hash = hash_sha256("contents of file2.txt")

# Parent node (directory)
dir_hash = hash_sha256(file1_hash + file2_hash)

print(f"file1.txt: {file1_hash}")
print(f"file2.txt: {file2_hash}")
print(f"directory: {dir_hash}")

# If file1 changes, dir_hash changes (integrity verification)
```

This is how Git tracks changes—each commit is a hash of the tree of all file hashes.

## Use Cases

### File Integrity & Checksums

**Problem:** Did this file download correctly? Has it been tampered with?

**Solution:** Compare hash of downloaded file to the published hash.

```bash
# Publisher provides:
# ubuntu-22.04-desktop-amd64.iso.sha256
curl -O https://releases.ubuntu.com/22.04/ubuntu-22.04-desktop-amd64.iso

# Verify integrity:
sha256sum ubuntu-22.04-desktop-amd64.iso
# Compare output to official sha256 file
```

### Digital Signatures

**Problem:** How do you sign a 4GB video file with RSA (which can only sign small data)?

**Solution:** Hash the file first, then sign the hash.

```
1. Hash the large file: hash(video.mp4) = abc123...
2. Sign the hash with your private key: signature = RSA_sign(abc123...)
3. Recipient verifies: RSA_verify(signature, abc123...) ← hash matches?
```

This is how code signing, SSL certificates, and PGP signatures work.

### Password Storage

**Problem:** How do you verify passwords without storing them in plaintext?

**Solution:** Store the hash. When user logs in, hash their input and compare.

```
Registration:
  user submits "password123"
  → hash with bcrypt → store "$2b$12$abc..." in database

Login:
  user submits "password123"
  → hash with bcrypt (using stored salt)
  → compare with stored hash
  → match? Authenticated.
```

**Critical:** Use bcrypt/argon2, NOT SHA-256. See "Password Hashing" section above.

### Git Commit IDs

Git commit IDs are SHA-1 hashes of commit metadata + file tree hashes.

```
commit 3f5a8c2e4b1d...  ← SHA-1 hash
Author: Alice
Date: 2024-01-15
Message: Fix bug in parser

+ hash of all files in this commit
```

If you change one byte of one file, the commit hash changes completely (avalanche effect). This makes Git's history tamper-evident.

**Note:** Git is migrating from SHA-1 to SHA-256 due to SHA-1 collision attacks.

### Blockchain (Proof of Work)

Bitcoin blocks include a hash of the previous block's hash. Changing any past transaction would change that block's hash, breaking the chain.

```
Block 1: hash = abc123...
Block 2: previous_hash = abc123..., hash = def456...
Block 3: previous_hash = def456..., hash = ghi789...
```

If you modify Block 1, its hash changes → Block 2's previous_hash no longer matches → chain is invalid.

### Data Deduplication

**Problem:** You have 1000 copies of the same file. How do you store it only once?

**Solution:** Hash every file. Files with the same hash are identical.

```
file1.jpg → hash = abc123
file2.jpg → hash = def456
file3.jpg → hash = abc123  ← Same as file1, don't store again
```

Dropbox, Git, and backup systems use this to save massive amounts of storage.

## Security Considerations

### Collision Attacks: Birthday Paradox

**The birthday paradox:** In a room of just 23 people, there's a 50% chance two share a birthday. Why? Because you're not asking "does anyone share MY birthday?" but "do ANY two people share a birthday?"

Hash collisions work the same way. To find a collision in an n-bit hash:
- **Brute force (preimage attack):** 2^n operations
- **Birthday attack (collision):** 2^(n/2) operations

**Example:**
- MD5 (128 bits): Collision in 2^64 operations (feasible on modern hardware)
- SHA-1 (160 bits): Collision in 2^80 operations (Google SHAttered: practical)
- SHA-256 (256 bits): Collision in 2^128 operations (not feasible with current or near-future technology)

**Why this matters:**
If an attacker can find collisions cheaply, they can:
- Substitute a malicious file with the same hash as a legitimate one
- Forge digital signatures
- Tamper with blockchain records

**Mitigation:** Use algorithms with collision resistance ≥2^128 (SHA-256, SHA-3, BLAKE2/3).

### Length Extension Attacks

**Vulnerable algorithms:** SHA-1, SHA-256, SHA-512, MD5  
**Resistant algorithms:** SHA-3, BLAKE2, BLAKE3, HMAC

**The attack:**
Given `hash(secret || message)`, attacker can compute `hash(secret || message || attacker_data)` without knowing `secret`.

**Example vulnerable code:**
```python
# ❌ DANGEROUS
token = sha256(secret + user_id)
# Attacker can extend this token to add privileges
```

**Fix #1: Use HMAC instead**
```python
# ✅ SAFE
import hmac
token = hmac.new(secret, user_id, hashlib.sha256).hexdigest()
```

**Fix #2: Use SHA-3 (not vulnerable to length extension)**
```python
# ✅ SAFE
token = hashlib.sha3_256(secret + user_id).hexdigest()
```

### Timing Attacks

**Problem:** Comparing hashes with `==` can leak information.

```python
# ❌ VULNERABLE
if user_hash == stored_hash:
    return True
```

String comparison stops at first mismatch:
- `abc123 == abc456` → checks 3 chars, then fails
- `abc123 == xyz789` → checks 1 char, then fails

Attacker can measure timing differences to guess the hash byte-by-byte.

**Fix: Constant-time comparison**
```python
# ✅ SAFE
import hmac
if hmac.compare_digest(user_hash, stored_hash):
    return True
```

This function always checks every byte, regardless of when it finds a mismatch.

## Common Pitfalls

### Using MD5 or SHA-1 for Security

**❌ Never do this:**
```python
password_hash = hashlib.md5(password.encode()).hexdigest()
# MD5 collisions are trivial, rainbow tables exist
```

**✅ Use password hashing algorithms:**
```python
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
```

### Hashing Passwords Without Salt

**❌ Vulnerable:**
```python
hash("password123") = abc123...
# Every user with this password has the same hash
# Rainbow tables can crack it instantly
```

**✅ Salted (bcrypt does this automatically):**
```python
user1: bcrypt($password, $random_salt_1) = xyz...
user2: bcrypt($password, $random_salt_2) = abc...
# Even with same password, hashes differ
```

### Trusting Client-Side Hashing

**❌ False security:**
```javascript
// Frontend hashes password before sending
password_hash = SHA256(password);
send_to_server(password_hash);
```

**Problem:** The hash IS now the password. If attacker steals the hash from your database, they can log in by submitting the hash directly.

**✅ Always hash on the server with a proper password hashing algorithm.**

### Truncating Hashes

**❌ Weakens security:**
```python
short_hash = hashlib.sha256(data).hexdigest()[:16]
# 256 bits → 64 bits
# Birthday attack now requires only 2^32 operations (trivial)
```

**✅ Use the full hash, or use an algorithm designed for shorter output (BLAKE2 with custom digest size).**

## See Also

- [[Digital Signatures]]
- [[Password Security]]
- [[Message Authentication Codes]]
- [[HMAC]]
- [[bcrypt]]
- [[argon2]]
- [[Blockchain]]
- [[Merkle Trees]]

## References

- [NIST FIPS 180-4: Secure Hash Standard (SHA-2)](https://csrc.nist.gov/publications/detail/fips/180/4/final)
- [NIST FIPS 202: SHA-3 Standard](https://csrc.nist.gov/publications/detail/fips/202/final)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [SHAttered: SHA-1 Collision Attack (2017)](https://shattered.io/)
- [BLAKE3 Specification](https://github.com/BLAKE3-team/BLAKE3-specs)
- [Wikipedia: Birthday Attack](https://en.wikipedia.org/wiki/Birthday_attack)
- [RFC 2104: HMAC Specification](https://datatracker.ietf.org/doc/html/rfc2104)
