---
title: Public Key Cryptography
chapter: cryptography
type: concept
difficulty: intermediate
prerequisites:
  - "[[Encryption Basics]]"
  - "[[Prime Numbers]]"
  - "[[Modular Arithmetic]]"
related:
  - "[[Diffie-Hellman Key Exchange]]"
  - "[[Digital Signatures]]"
  - "[[RSA]]"
tags:
  - cryptography
  - public-key
  - asymmetric-encryption
  - rsa
  - ecc
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Public Key Cryptography

## Overview

Public key cryptography (also called asymmetric cryptography) uses pairs of keys—a public key that can be shared openly and a private key that must be kept secret. Unlike symmetric encryption where the same key encrypts and decrypts, public key cryptography uses different keys for these operations. This breakthrough enables secure communication without pre-sharing secrets.

Think of it like a mailbox: anyone can drop a letter through the slot (encrypt with public key), but only the owner with the key can open it and read the contents (decrypt with private key).

## Core Concept

Public key cryptography solves a fundamental problem: **How can two parties communicate securely without first sharing a secret key through a secure channel?**

**The key pair**:
- **Public key**: Shared openly, used to encrypt messages
- **Private key**: Kept secret, used to decrypt messages

**Mathematical relationship**: The keys are mathematically related through one-way functions—easy to compute forward, computationally infeasible to reverse.

**Core properties**:
1. **Encrypt with public key** → **Decrypt with private key**
2. Knowing the public key doesn't reveal the private key
3. Computing the private key from the public key is infeasible

## How It Works

### Encryption Flow

**Alice wants to send Bob a secure message**:

1. Bob generates a key pair (public + private)
2. Bob shares his public key with Alice (and the world)
3. Alice encrypts her message using Bob's public key
4. Alice sends the ciphertext to Bob
5. Bob decrypts the ciphertext using his private key

**Key insight**: Only Bob can decrypt messages encrypted with his public key. Not even Alice can decrypt her own message after encryption.

### Visual Example

```
Alice's message: "HELLO"

Bob's public key: Available to everyone
Bob's private key: Secret, known only to Bob

Alice:
  "HELLO" + Bob's public key → Encrypt → "X7#9K2@"

Transmission: "X7#9K2@" (safe to send over insecure channel)

Bob:
  "X7#9K2@" + Bob's private key → Decrypt → "HELLO"

Eve (eavesdropper):
  Has: "X7#9K2@" and Bob's public key
  Cannot: Decrypt without Bob's private key
```

## RSA (Rivest-Shamir-Adleman)

The most widely used public key algorithm.

### Mathematical Foundation

Based on the difficulty of factoring large numbers:
- Easy: Multiply two large primes (p × q = n)
- Hard: Factor n back into p and q

### Key Generation

```python
import random

def generate_rsa_keys(bits=2048):
    # 1. Choose two large prime numbers p and q
    p = generate_large_prime(bits // 2)
    q = generate_large_prime(bits // 2)

    # 2. Compute n = p × q (public modulus)
    n = p * q

    # 3. Compute φ(n) = (p-1) × (q-1) (Euler's totient)
    phi = (p - 1) * (q - 1)

    # 4. Choose public exponent e (commonly 65537)
    e = 65537

    # 5. Compute private exponent d (modular inverse of e mod φ(n))
    d = mod_inverse(e, phi)

    # Public key: (e, n)
    # Private key: (d, n)
    return (e, n), (d, n)
```

**Public key**: (e, n) — shared openly
**Private key**: (d, n) — kept secret

### Encryption and Decryption

**Encryption**: c = m^e mod n
**Decryption**: m = c^d mod n

```python
def rsa_encrypt(message, public_key):
    e, n = public_key
    # Convert message to number, encrypt
    m = int.from_bytes(message.encode(), 'big')
    c = pow(m, e, n)  # m^e mod n
    return c

def rsa_decrypt(ciphertext, private_key):
    d, n = private_key
    # Decrypt, convert back to message
    m = pow(ciphertext, d, n)  # c^d mod n
    message = m.to_bytes((m.bit_length() + 7) // 8, 'big').decode()
    return message
```

**Example** (small numbers for illustration):
```
p = 61, q = 53
n = 3233, φ(n) = 3120
e = 17, d = 2753

Message: 123
Encrypt: 123^17 mod 3233 = 855
Decrypt: 855^2753 mod 3233 = 123 ✓
```

### RSA in Practice

```python
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Generate key pair
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()

# Encrypt
message = b"Secret message"
ciphertext = public_key.encrypt(
    message,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# Decrypt
plaintext = private_key.decrypt(
    ciphertext,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)
```

## Elliptic Curve Cryptography (ECC)

Alternative to RSA with smaller keys and better performance.

### Mathematical Foundation

Based on the difficulty of the **Elliptic Curve Discrete Logarithm Problem**:
- Easy: Compute Q = k × P (scalar multiplication on curve)
- Hard: Find k given P and Q

### Key Advantages

**Smaller keys**:
- 256-bit ECC ≈ 3072-bit RSA (equivalent security)
- Faster computations
- Less bandwidth
- Less storage

**Example key sizes** (for equivalent security):
| RSA      | ECC  |
|----------|------|
| 1024-bit | 160-bit |
| 2048-bit | 224-bit |
| 3072-bit | 256-bit |
| 15360-bit | 521-bit |

### Common Curves

**NIST P-256** (secp256r1): Widely supported, government standard
**Curve25519**: Modern, designed for performance and security
**secp256k1**: Used in Bitcoin and Ethereum

### ECC in Practice

```python
from cryptography.hazmat.primitives.asymmetric import ec

# Generate key pair
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()

# Note: ECC is typically used for key exchange and signatures,
# not direct encryption (unlike RSA)
```

## Use Cases

### Secure Communication

**Scenario**: Alice and Bob never met but want to communicate securely.

**Solution**:
1. Bob publishes his public key
2. Alice encrypts messages with Bob's public key
3. Only Bob can decrypt with his private key

**Used in**: Email encryption (PGP), secure messaging

### Hybrid Encryption

**Problem**: Public key encryption is slow for large messages.

**Solution**: Combine symmetric and asymmetric encryption:
1. Generate random symmetric key (AES key)
2. Encrypt message with symmetric key (fast)
3. Encrypt symmetric key with recipient's public key (small data)
4. Send both encrypted message and encrypted key

```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os

# Generate symmetric key
aes_key = os.urandom(32)

# Encrypt large message with AES (symmetric, fast)
cipher = Cipher(algorithms.AES(aes_key), modes.GCM(os.urandom(12)))
encryptor = cipher.encryptor()
ciphertext = encryptor.update(large_message) + encryptor.finalize()

# Encrypt AES key with RSA (asymmetric, small data)
encrypted_key = public_key.encrypt(aes_key, padding.OAEP(...))

# Send both encrypted message and encrypted key
```

**Used in**: TLS/SSL, PGP, S/MIME

### Digital Signatures

Use private key to sign, public key to verify (reverse of encryption).

**Purpose**: Prove message authenticity and integrity.

```python
# Sign with private key
signature = private_key.sign(
    message,
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    hashes.SHA256()
)

# Anyone can verify with public key
public_key.verify(
    signature,
    message,
    padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
    ),
    hashes.SHA256()
)
```

**Used in**: Code signing, document signing, SSL certificates

### Key Exchange

Establish shared secrets without transmitting them.

**See**: [[Diffie-Hellman Key Exchange]]

## Security Considerations

### Key Length

**Minimum recommendations** (as of 2026):
- RSA: 2048-bit (3072-bit for long-term security)
- ECC: 256-bit (384-bit for long-term security)

**Why it matters**: Computing power increases over time. Longer keys resist brute force attacks longer.

### Padding

**Never use "textbook RSA"** (raw mathematical operations):

```python
# INSECURE - Textbook RSA
c = pow(m, e, n)
```

**Always use padding schemes**:
- **OAEP** (Optimal Asymmetric Encryption Padding) for encryption
- **PSS** (Probabilistic Signature Scheme) for signatures

**Why**: Padding prevents attacks that exploit mathematical properties.

### Private Key Protection

**Store private keys securely**:
- Encrypted at rest
- Access-controlled
- Hardware Security Modules (HSMs) for critical keys
- Never transmit private keys

**Compromise**: If private key leaks, attacker can:
- Decrypt all past messages (if captured)
- Impersonate the key owner
- Sign malicious content

### Quantum Computing Threat

**Problem**: Shor's algorithm can break RSA and ECC on quantum computers.

**Timeline**: Practical quantum computers may exist by 2030-2040.

**Response**: Post-quantum cryptography research (lattice-based, hash-based algorithms).

## Common Pitfalls

**Encrypting large data directly**: Use hybrid encryption instead.

**Reusing keys across contexts**: Generate separate key pairs for encryption and signing.

**Using small key sizes**: 1024-bit RSA is deprecated. Use ≥2048-bit.

**Implementing crypto yourself**: Use established libraries (OpenSSL, libsodium, cryptography.io).

**Not validating public keys**: Ensure public keys come from trusted sources (see [[PKI]]).

## Performance Characteristics

**RSA operations**:
- Key generation: Slow (seconds for 2048-bit)
- Encryption: Fast (public key operation)
- Decryption: Slow (private key operation)
- Size: Large keys and ciphertexts

**ECC operations**:
- Key generation: Fast
- Encryption/Decryption: Faster than RSA
- Size: Much smaller keys

**Comparison** (rough estimates):
| Operation | RSA 2048-bit | ECC 256-bit |
|-----------|--------------|-------------|
| Key gen | 100ms | 10ms |
| Sign | 5ms | 0.5ms |
| Verify | 0.5ms | 1ms |
| Key size | 256 bytes | 32 bytes |

## See Also

- [[Diffie-Hellman Key Exchange]]
- [[Digital Signatures]]
- [[Symmetric Encryption]]
- [[TLS/SSL]]
- [[PKI and Certificates]]

## References

- Rivest, Shamir, Adleman. "A Method for Obtaining Digital Signatures and Public-Key Cryptosystems" (1978)
- Koblitz, Neal. "Elliptic Curve Cryptosystems" (1987)
- [NIST Special Publication 800-57: Key Management](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- "Cryptography Engineering" (Ferguson, Schneier, Kohno)
- [RFC 8017: PKCS #1: RSA Cryptography Specifications](https://www.rfc-editor.org/rfc/rfc8017)
