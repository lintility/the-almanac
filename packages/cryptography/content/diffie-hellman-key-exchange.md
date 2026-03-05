---
title: Diffie-Hellman Key Exchange
chapter: cryptography
type: protocol
difficulty: intermediate
prerequisites:
  - "[[Modular Arithmetic]]"
  - "[[Prime Numbers]]"
  - "[[Public Key Cryptography]]"
related:
  - "[[Elliptic Curve Cryptography]]"
  - "[[Perfect Forward Secrecy]]"
  - "[[TLS/SSL]]"
tags:
  - cryptography
  - key-exchange
  - diffie-hellman
  - dh
  - ecdh
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Diffie-Hellman Key Exchange

## Overview

Diffie-Hellman (DH) is a cryptographic protocol that allows two parties to establish a shared secret key over an insecure channel without ever directly transmitting the key. This breakthrough enables secure communication between parties who have never met and have no prior shared secrets.

Think of it like two people each choosing a secret color, mixing it with a shared public color, exchanging the mixed results, then each mixing in their original secret again—both end up with the same final color, but an observer can't determine what it is.

## Core Concept

**The problem**: Alice and Bob want to communicate securely, but:
- They've never met
- They have no shared secret
- All communication is over a public, insecure channel
- Eve can see everything they exchange

**The solution**: Diffie-Hellman allows Alice and Bob to:
1. Each generate a private secret
2. Exchange public values (derived from their secrets)
3. Independently compute the same shared secret
4. Use this shared secret for symmetric encryption

**Key insight**: Eve sees the public values but can't compute the shared secret (assuming the discrete logarithm problem is hard).

## How It Works

### Setup (Public Parameters)

**Agreed upon publicly**:
- **p**: A large prime number (e.g., 2048 bits)
- **g**: A generator (primitive root modulo p)

These can be standardized and reused.

### The Protocol

**Alice**:
1. Chooses private secret **a** (random number)
2. Computes public value **A = g^a mod p**
3. Sends A to Bob (publicly)

**Bob**:
1. Chooses private secret **b** (random number)
2. Computes public value **B = g^b mod p**
3. Sends B to Alice (publicly)

**Alice computes shared secret**:
- S = B^a mod p = (g^b)^a mod p = g^(ab) mod p

**Bob computes shared secret**:
- S = A^b mod p = (g^a)^b mod p = g^(ab) mod p

**Result**: Both have the same shared secret S = g^(ab) mod p

### Visual Example

```
Public: p = 23, g = 5

Alice:                          Bob:
Private: a = 6                  Private: b = 15
Public: A = 5^6 mod 23 = 8     Public: B = 5^15 mod 23 = 19

        Send A = 8  ────────────→
        ←──────────── Send B = 19

Shared secret:                  Shared secret:
S = 19^6 mod 23 = 2            S = 8^15 mod 23 = 2

✓ Both computed S = 2
```

**Eve sees**: p=23, g=5, A=8, B=19
**Eve wants**: The value 2
**Eve's problem**: Computing discrete log is hard—can't find a or b from A or B

## Mathematical Foundation

### Discrete Logarithm Problem

**Easy direction**: Given g, a, p → compute g^a mod p (modular exponentiation)

**Hard direction**: Given g, g^a, p → find a (discrete logarithm)

**Security**: Diffie-Hellman's security relies on this asymmetry.

**Example**:
- Easy: 5^6 mod 23 = 8 (can compute quickly)
- Hard: Given 5, 8, 23 → find 6 (requires trying many values)

For large primes (2048+ bits), the hard direction is computationally infeasible.

## Implementation

### Basic Diffie-Hellman

```python
import secrets

def generate_dh_parameters(bits=2048):
    # In practice, use standardized parameters (RFC 3526)
    # Simplified for illustration
    p = generate_safe_prime(bits)
    g = 2  # Common generator
    return p, g

def generate_private_key(p):
    # Random number in range [2, p-2]
    return secrets.randbelow(p - 2) + 2

def compute_public_key(g, private_key, p):
    # g^private_key mod p
    return pow(g, private_key, p)

def compute_shared_secret(their_public, my_private, p):
    # their_public^my_private mod p
    return pow(their_public, my_private, p)

# Example usage
p, g = generate_dh_parameters()

# Alice
alice_private = generate_private_key(p)
alice_public = compute_public_key(g, alice_private, p)

# Bob
bob_private = generate_private_key(p)
bob_public = compute_public_key(g, bob_private, p)

# Exchange public keys (can be sent over insecure channel)
# ...

# Compute shared secret
alice_shared = compute_shared_secret(bob_public, alice_private, p)
bob_shared = compute_shared_secret(alice_public, bob_private, p)

assert alice_shared == bob_shared  # Both have same secret
```

### Using Cryptography Library

```python
from cryptography.hazmat.primitives.asymmetric import dh
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

# Generate DH parameters (or use standardized ones)
parameters = dh.generate_parameters(generator=2, key_size=2048)

# Alice generates key pair
alice_private_key = parameters.generate_private_key()
alice_public_key = alice_private_key.public_key()

# Bob generates key pair
bob_private_key = parameters.generate_private_key()
bob_public_key = bob_private_key.public_key()

# Alice computes shared secret
alice_shared = alice_private_key.exchange(bob_public_key)

# Bob computes shared secret
bob_shared = bob_private_key.exchange(alice_public_key)

# Derive symmetric key from shared secret (using KDF)
def derive_key(shared_secret):
    return HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=None,
        info=b'handshake data'
    ).derive(shared_secret)

alice_key = derive_key(alice_shared)
bob_key = derive_key(bob_shared)

assert alice_key == bob_key  # Same encryption key
```

## Elliptic Curve Diffie-Hellman (ECDH)

Modern variant using elliptic curves—smaller keys, better performance.

### Advantages

**Efficiency**:
- 256-bit ECDH ≈ 3072-bit traditional DH (equivalent security)
- Faster computations
- Less bandwidth

**Example**:
```python
from cryptography.hazmat.primitives.asymmetric import ec

# Alice
alice_private_key = ec.generate_private_key(ec.SECP256R1())
alice_public_key = alice_private_key.public_key()

# Bob
bob_private_key = ec.generate_private_key(ec.SECP256R1())
bob_public_key = bob_private_key.public_key()

# Compute shared secret
alice_shared = alice_private_key.exchange(ec.ECDH(), bob_public_key)
bob_shared = bob_private_key.exchange(ec.ECDH(), alice_public_key)

assert alice_shared == bob_shared
```

### Common Curves

**Curve25519**: Modern, fast, secure (used in Signal, WireGuard)
**SECP256R1** (P-256): NIST standard, widely supported
**SECP256K1**: Used in Bitcoin

## Security Properties

### Forward Secrecy

If private keys are ephemeral (generated per-session and destroyed):
- Compromise of long-term keys doesn't expose past sessions
- Each session has independent secrets

**Implementation**: Generate new DH key pairs for each connection.

**Used in**: TLS 1.3, Signal Protocol, WireGuard

### Man-in-the-Middle Vulnerability

**Problem**: DH doesn't authenticate the parties.

**Attack scenario**:
```
Alice ←→ Eve ←→ Bob

Alice thinks she's talking to Bob (actually Eve)
Bob thinks he's talking to Alice (actually Eve)
Eve decrypts, reads, re-encrypts all messages
```

**Solution**: Authenticate the key exchange:
- Digital signatures (Alice signs her public key)
- Pre-shared keys
- Certificates (PKI)
- Out-of-band verification (fingerprint comparison)

## Real-World Applications

### TLS/SSL Handshake

HTTPS connections use ECDHE (Ephemeral Elliptic Curve Diffie-Hellman):

1. Client and server exchange ECDH public keys
2. Both compute shared secret
3. Derive symmetric encryption keys
4. Use AES-GCM for actual data encryption

**Why DH**: Perfect forward secrecy—compromising server's private key doesn't reveal past session keys.

### Signal Protocol

End-to-end encrypted messaging:
- Extended Diffie-Hellman (X3DH) for initial key agreement
- Double Ratchet algorithm for ongoing key rotation
- Combines multiple DH exchanges for enhanced security

### VPNs

WireGuard and IKEv2 use ECDH for establishing VPN tunnels:
- Fast key exchange
- Perfect forward secrecy
- Minimal handshake overhead

### SSH

OpenSSH supports DH and ECDH for key exchange:
- Establishes session keys
- Different key per connection
- Prevents replay attacks

## Common Pitfalls

### Using Small Parameters

**Weak primes**: p must be large (≥2048-bit) and carefully chosen.

**Weak generators**: g must be a proper generator.

**Solution**: Use standardized parameters (RFC 3526, RFC 7919).

### Reusing Private Keys

**Problem**: Long-lived private keys compromise forward secrecy.

**Solution**: Generate ephemeral keys per-session (ECDHE, DHE).

### Not Authenticating the Exchange

**Problem**: Vulnerable to man-in-the-middle attacks.

**Solution**: Combine with authentication:
```python
# Sign public key with long-term signing key
signature = signing_key.sign(public_key_bytes)

# Recipient verifies signature before computing shared secret
verify_key.verify(signature, public_key_bytes)
```

### Using the Shared Secret Directly

**Problem**: Raw DH output has structure, isn't uniformly random.

**Solution**: Use a Key Derivation Function (KDF):
```python
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

symmetric_key = HKDF(
    algorithm=hashes.SHA256(),
    length=32,
    salt=None,
    info=b'application context'
).derive(shared_secret)
```

### Small Subgroup Attacks

**Problem**: Attacker forces weak shared secrets.

**Mitigation**: Validate received public keys are in valid range.

## Performance Characteristics

**Traditional DH (2048-bit)**:
- Key generation: ~50-100ms
- Exchange computation: ~10-50ms
- Public key size: 256 bytes

**ECDH (Curve25519)**:
- Key generation: ~0.1ms
- Exchange computation: ~0.1ms
- Public key size: 32 bytes

**Typical workflow**:
1. DH/ECDH key exchange: 1-100ms (depends on parameters)
2. Symmetric encryption: Microseconds per message

**Tradeoff**: One-time DH cost enables fast symmetric encryption for all subsequent messages.

## Standardized Parameters

**RFC 3526** (Traditional DH):
- Predefined safe primes for various key sizes
- Commonly used groups: 2048-bit, 3072-bit, 4096-bit

**RFC 7919** (Finite Field DH for TLS):
- Updated parameters for modern security

**NIST Curves** (ECDH):
- P-256, P-384, P-521

**Modern Curves**:
- Curve25519 (X25519 for ECDH)
- Curve448 (X448 for ECDH)

## See Also

- [[Public Key Cryptography]]
- [[Elliptic Curve Cryptography]]
- [[Perfect Forward Secrecy]]
- [[TLS/SSL]]
- [[Digital Signatures]]

## References

- Diffie, W.; Hellman, M. (1976). "New Directions in Cryptography"
- [RFC 2631: Diffie-Hellman Key Agreement Method](https://www.rfc-editor.org/rfc/rfc2631)
- [RFC 7748: Elliptic Curves for Security](https://www.rfc-editor.org/rfc/rfc7748) (Curve25519, Curve448)
- [RFC 7919: Negotiated Finite Field Diffie-Hellman Ephemeral Parameters for TLS](https://www.rfc-editor.org/rfc/rfc7919)
- "Cryptography Engineering" (Ferguson, Schneier, Kohno)
