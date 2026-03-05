---
title: Encryption at Rest
chapter: cryptography
type: concept
difficulty: intermediate
prerequisites:
  - "[[Symmetric Encryption]]"
  - "[[Key Management]]"
related:
  - "[[Encryption in Transit]]"
  - "[[Full Disk Encryption]]"
  - "[[Database Encryption]]"
tags:
  - cryptography
  - encryption
  - data-protection
  - storage
status: published
created: "2026-02-16"
updated: "2026-02-16"
author: Almanac Bot
---

# Encryption at Rest

## Overview

Encryption at rest protects data when it's stored on disk, in databases, or in backups. If someone steals the physical hardware, gains unauthorized access to storage, or compromises a backup, they can't read the data without the encryption keys.

Think of it like this: Your house might have locks on the doors ([[Encryption in Transit]]), but encryption at rest is the safe where you store your valuables. Even if a burglar breaks in, they can't open the safe without the combination.

**The key principle:** Encrypt data before it touches persistent storage. Decrypt it only when authorized applications need to read it.

## Core Concept

Encryption at rest addresses a simple threat model:

**The attack:**
1. Attacker steals hard drive
2. Attacker plugs drive into their own machine
3. Attacker reads sensitive data

**The defense:**
1. Data encrypted with AES-256
2. Encryption key stored separately (not on the drive)
3. Without the key, drive contents are gibberish

### Data at Rest vs. Data in Transit

| Aspect | Data at Rest | Data in Transit |
|--------|-------------|-----------------|
| **Location** | Stored (disk, database) | Moving (network) |
| **Threat** | Physical theft, storage access | Eavesdropping, interception |
| **Protection** | Disk/DB encryption | TLS, VPN |
| **Key storage** | Separate from data | Ephemeral (session keys) |

**Both are necessary.** Encrypting data at rest doesn't protect it during transmission. Encrypting data in transit doesn't protect it once stored. You need both.

## Common Implementation Methods

### Full Disk Encryption (FDE)

**Encrypts the entire disk—OS, applications, and data.**

**Popular implementations:**
- **LUKS (Linux Unified Key Setup)** — Standard for Linux
- **BitLocker** — Windows built-in FDE
- **FileVault** — macOS built-in FDE
- **VeraCrypt** — Cross-platform (successor to TrueCrypt)

**How it works:**
```
Boot sequence:
1. BIOS/UEFI loads bootloader
2. Bootloader prompts for password/key
3. Decrypt disk encryption key with password
4. Mount encrypted volume
5. OS boots normally

All disk I/O transparently encrypted/decrypted by kernel
```

**Strengths:**
- Protects entire system (including swap, temp files)
- Transparent to applications (no code changes)
- Protects against physical theft
- OS-level integration (no third-party software needed for LUKS/BitLocker/FileVault)

**Weaknesses:**
- Decrypted while system is running (vulnerable to memory attacks)
- If attacker boots into your OS, they have access (if auto-login enabled)
- Performance overhead (~5-10% for modern CPUs with AES-NI)

**When to use:**
- Laptops (high theft risk)
- Mobile devices
- Desktop workstations with sensitive data
- Servers in untrusted data centers

### Database Encryption (Transparent Data Encryption - TDE)

**Encrypts database files, transaction logs, and backups.**

**Implementations:**
- **SQL Server TDE** — Microsoft SQL Server
- **Oracle TDE** — Oracle Database
- **MySQL/MariaDB encryption** — InnoDB tablespace encryption
- **PostgreSQL** — pgcrypto extension or full-cluster encryption

**How it works:**
```
Application → SQL query → Database engine
                              ↓
                   Encrypt/decrypt data pages
                              ↓
                     Write to disk (encrypted)
```

**Strengths:**
- Transparent to applications (no code changes)
- Encrypts backups automatically
- Centralized key management
- Protects against storage theft

**Weaknesses:**
- Doesn't protect against SQL injection (attacker uses legitimate database access)
- Decrypted data in memory (vulnerable to memory dumps)
- Doesn't protect against DBA access (DBAs can read plaintext)
- Key management complexity

**When to use:**
- Databases with PII (personally identifiable information)
- Compliance requirements (PCI-DSS, HIPAA, GDPR)
- Multi-tenant databases
- Cloud-hosted databases

### File-Level Encryption

**Encrypt individual files or folders.**

**Tools:**
- **GPG (GnuPG)** — Encrypt files with public key cryptography
- **EncFS** — Encrypted filesystem (FUSE-based)
- **7-Zip** — Archive encryption (AES-256)
- **Age** — Modern file encryption tool (simpler than GPG)

**How it works:**
```bash
# Encrypt file with GPG
gpg --encrypt --recipient alice@example.com secret.txt
# Output: secret.txt.gpg (encrypted)

# Decrypt
gpg --decrypt secret.txt.gpg > secret.txt
```

**Strengths:**
- Fine-grained control (encrypt only sensitive files)
- Portable (encrypted files can be stored anywhere)
- No performance impact on non-encrypted files
- Works on any OS

**Weaknesses:**
- Manual process (easy to forget to encrypt)
- Metadata leakage (filename, size, timestamps visible)
- No protection for in-memory data
- Key management complexity (user responsibility)

**When to use:**
- Sensitive documents (tax returns, medical records)
- Shared storage (Dropbox, Google Drive)
- Backups of sensitive data
- Cross-platform file exchange

### Application-Level Encryption

**Encrypt data within the application before storing it.**

**Examples:**
- Encrypt credit card numbers before INSERT into database
- Encrypt user passwords with bcrypt/argon2
- Encrypt sensitive fields (SSN, medical records)

**How it works:**
```python
from cryptography.fernet import Fernet

# Generate key (store securely, NOT in code!)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt before storing
plaintext = "123-45-6789"  # SSN
encrypted = cipher.encrypt(plaintext.encode())
db.execute("INSERT INTO users (ssn) VALUES (?)", (encrypted,))

# Decrypt when reading
encrypted_ssn = db.query("SELECT ssn FROM users WHERE id=1")[0]
plaintext_ssn = cipher.decrypt(encrypted_ssn).decode()
```

**Strengths:**
- Fine-grained control (encrypt only sensitive fields)
- Protects against database compromise (even if DB is stolen, data is encrypted)
- Can use different keys for different data types
- Application logic controls who can decrypt

**Weaknesses:**
- Code changes required
- Index/search limitations (can't query encrypted fields efficiently)
- Key management complexity
- Developer responsibility (easy to get wrong)

**When to use:**
- Highly sensitive fields (credit cards, SSNs, health data)
- Multi-tenant applications (encrypt each tenant's data with different key)
- Zero-knowledge systems (server never sees plaintext)

### Cloud Provider Encryption

**AWS, Azure, GCP provide managed encryption services.**

**AWS:**
- **EBS Encryption** — Encrypts EC2 instance volumes
- **S3 Server-Side Encryption (SSE)** — SSE-S3, SSE-KMS, SSE-C
- **RDS Encryption** — Database encryption at rest

**Azure:**
- **Azure Disk Encryption** — VM disk encryption
- **Azure Storage Service Encryption (SSE)** — Blob, Queue, Table, Files
- **SQL Database TDE** — Transparent data encryption

**GCP:**
- **Persistent Disk Encryption** — Compute Engine volumes
- **Cloud Storage Encryption** — Default encryption for buckets
- **Cloud SQL Encryption** — Database encryption

**How it works (AWS S3 example):**
```bash
# Enable default encryption on bucket
aws s3api put-bucket-encryption \
  --bucket my-bucket \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "arn:aws:kms:us-east-1:123456789012:key/abc-123"
      }
    }]
  }'

# Upload file (automatically encrypted)
aws s3 cp secret.txt s3://my-bucket/
```

**Strengths:**
- Transparent (no code changes)
- Managed by cloud provider
- FIPS 140-2 validated HSMs
- Automatic key rotation
- Integrated with IAM

**Weaknesses:**
- Vendor lock-in (keys tied to cloud provider)
- Trust in cloud provider (they can decrypt your data)
- Cost (KMS API calls add up)

**When to use:**
- Cloud-native applications
- Compliance requirements (many frameworks accept cloud-managed encryption)
- Minimal operational overhead desired

## Key Management: The Hard Part

**The fundamental problem:**

Encrypting data is easy. Protecting the encryption keys is hard.

> "If you store the key with the data, you haven't encrypted anything—you've just obfuscated it."

### Where NOT to Store Keys

**❌ In the same database as encrypted data:**
```python
# TERRIBLE IDEA
db.execute("INSERT INTO secrets (data, encryption_key) VALUES (?, ?)", 
           (encrypted_data, encryption_key))
# Attacker steals DB → has both data and key
```

**❌ In application source code:**
```python
# BAD
ENCRYPTION_KEY = "abc123hardcodedkey456"
```

**❌ In version control:**
```bash
# .env file committed to Git
ENCRYPTION_KEY=secret_key_do_not_share
# Now it's in the repo history forever
```

**❌ In environment variables (sometimes):**
- OK for dev/test environments
- NOT OK for production (can leak via /proc, logs, crash dumps)

### Where TO Store Keys

#### Hardware Security Module (HSM)

**Tamper-resistant hardware device that stores keys.**

**Features:**
- Keys generated in HSM, never leave the device
- FIPS 140-2/3 certified
- Tamper detection (self-destructs if opened)
- Crypto operations performed inside HSM

**Implementations:**
- **AWS CloudHSM** — Dedicated HSM in AWS
- **Thales/Luna HSM** — On-premises hardware
- **YubiHSM** — USB-based mini-HSM

**Cost:** $1,000 - $50,000 for on-prem; $1.50/hour for AWS CloudHSM

**When to use:**
- Financial systems (payment processing)
- Certificate authorities (CA private keys)
- Code signing (protect signing keys)
- Ultra-high-security environments

#### Key Management Service (KMS)

**Cloud-based key storage and cryptographic operations.**

**Implementations:**
- **AWS KMS** — Managed service, backed by HSMs
- **Azure Key Vault** — Azure's KMS
- **Google Cloud KMS** — GCP's KMS
- **HashiCorp Vault** — Self-hosted, multi-cloud

**How it works (AWS KMS example):**
```python
import boto3

kms = boto3.client('kms')

# Encrypt data with KMS key
response = kms.encrypt(
    KeyId='arn:aws:kms:us-east-1:123456789012:key/abc-123',
    Plaintext=b'secret data'
)
ciphertext = response['CiphertextBlob']

# Decrypt
response = kms.decrypt(CiphertextBlob=ciphertext)
plaintext = response['Plaintext']
```

**Strengths:**
- Managed service (no hardware to buy/maintain)
- Audit logging (who accessed which key when)
- IAM integration (fine-grained access control)
- Automatic key rotation

**Weaknesses:**
- Trust in cloud provider
- API call costs
- Network latency (for on-prem applications)

**Cost:** ~$1/month per key + $0.03 per 10,000 API calls

#### Envelope Encryption

**Encrypt data with a Data Encryption Key (DEK), then encrypt the DEK with a Key Encryption Key (KEK).**

**Why it's better:**
```
Without envelope encryption:
- Encrypt 1 GB file with KMS → 1 GB sent to KMS API (slow, expensive)

With envelope encryption:
- Generate random DEK locally
- Encrypt 1 GB file with DEK (fast, local)
- Encrypt DEK with KMS KEK (only 256 bits sent to KMS)
- Store encrypted file + encrypted DEK
```

**Diagram:**
```
Plaintext Data
     ↓ Encrypt with DEK (local, fast)
Encrypted Data
     ↓ Store
Disk

DEK (random, never reused)
     ↓ Encrypt with KEK (via KMS)
Encrypted DEK
     ↓ Store with data
Disk

KEK (master key)
     ↓ Stored in KMS/HSM (never leaves)
```

**Benefits:**
- Performance (local encryption, not KMS API for every byte)
- Cost (fewer KMS API calls)
- Offline encryption (pre-generate encrypted DEKs)

**Used by:** AWS S3 encryption, Google Cloud Storage, most cloud services

### Key Rotation

**Why rotate keys:**
- Limit exposure if key is compromised
- Compliance requirements (PCI-DSS: rotate annually)
- Cryptographic best practice

**Two approaches:**

**Re-encrypt data (expensive):**
```
1. Generate new key
2. Decrypt all data with old key
3. Re-encrypt all data with new key
4. Destroy old key
```

**Envelope encryption rotation (efficient):**
```
1. Generate new KEK
2. Re-encrypt DEKs with new KEK (only small keys, not data)
3. Old data remains encrypted with old DEKs (still valid)
4. New data uses new DEK + new KEK
```

**AWS KMS automatic rotation:**
```bash
# Enable automatic key rotation (yearly)
aws kms enable-key-rotation --key-id abc-123

# KMS handles rotation transparently
# Old ciphertext can still be decrypted (KMS tracks key versions)
```

## Implementation Examples

### LUKS Full Disk Encryption (Linux)

```bash
# Create encrypted partition
sudo cryptsetup luksFormat /dev/sdb1
# Prompts for passphrase

# Open encrypted volume
sudo cryptsetup luksOpen /dev/sdb1 encrypted_volume

# Create filesystem
sudo mkfs.ext4 /dev/mapper/encrypted_volume

# Mount
sudo mount /dev/mapper/encrypted_volume /mnt/secure

# Use normally
echo "secret data" | sudo tee /mnt/secure/secret.txt

# Unmount and close
sudo umount /mnt/secure
sudo cryptsetup luksClose encrypted_volume

# Disk is now encrypted, data unreadable without passphrase
```

**Auto-unlock on boot (with keyfile):**
```bash
# Generate keyfile
sudo dd if=/dev/urandom of=/root/keyfile bs=1024 count=4
sudo chmod 600 /root/keyfile

# Add keyfile to LUKS
sudo cryptsetup luksAddKey /dev/sdb1 /root/keyfile

# Edit /etc/crypttab
encrypted_volume /dev/sdb1 /root/keyfile luks

# Edit /etc/fstab
/dev/mapper/encrypted_volume /mnt/secure ext4 defaults 0 2

# Now mounts automatically on boot
```

### BitLocker (Windows)

**Enable BitLocker via GUI:**
```
Control Panel → BitLocker Drive Encryption → Turn on BitLocker
Follow wizard (choose password or smart card)
Save recovery key (CRITICAL: store somewhere safe!)
```

**Enable BitLocker via PowerShell:**
```powershell
# Enable BitLocker on C: drive
Enable-BitLocker -MountPoint "C:" -EncryptionMethod Aes256 -UsedSpaceOnly

# Save recovery key to file
(Get-BitLockerVolume -MountPoint "C:").KeyProtector | 
  Where-Object {$_.KeyProtectorType -eq "RecoveryPassword"} | 
  Out-File C:\recovery_key.txt

# Store recovery_key.txt somewhere SAFE (not on C:!)
```

**Unlock BitLocker drive on another machine:**
```powershell
# Mount encrypted drive
Unlock-BitLocker -MountPoint "E:" -RecoveryPassword "123456-789012-345678-901234-567890-123456"
```

### AWS S3 Server-Side Encryption

**SSE-S3 (AWS-managed keys):**
```python
import boto3

s3 = boto3.client('s3')

# Upload with automatic encryption
s3.put_object(
    Bucket='my-bucket',
    Key='secret.txt',
    Body=b'secret data',
    ServerSideEncryption='AES256'  # AWS manages keys
)
```

**SSE-KMS (Customer-managed KMS keys):**
```python
# Upload with KMS encryption
s3.put_object(
    Bucket='my-bucket',
    Key='secret.txt',
    Body=b'secret data',
    ServerSideEncryption='aws:kms',
    SSEKMSKeyId='arn:aws:kms:us-east-1:123456789012:key/abc-123'
)

# AWS KMS logs every access to the key (audit trail)
```

**Client-side encryption (encrypt before upload):**
```python
from cryptography.fernet import Fernet

# Generate key (store in KMS, not in code!)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt locally
plaintext = b'very secret data'
ciphertext = cipher.encrypt(plaintext)

# Upload encrypted data (AWS never sees plaintext)
s3.put_object(Bucket='my-bucket', Key='secret.txt', Body=ciphertext)
```

### Application-Level Field Encryption (Python)

**Encrypt sensitive database fields:**
```python
from cryptography.fernet import Fernet
from sqlalchemy import Column, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    email = Column(String)  # Plaintext (need to query by email)
    ssn_encrypted = Column(LargeBinary)  # Encrypted

# Encryption helper
class FieldEncryptor:
    def __init__(self, key):
        self.cipher = Fernet(key)
    
    def encrypt(self, plaintext):
        return self.cipher.encrypt(plaintext.encode())
    
    def decrypt(self, ciphertext):
        return self.cipher.decrypt(ciphertext).decode()

# Load key from secure storage (KMS, Vault, etc.)
encryptor = FieldEncryptor(key=load_key_from_kms())

# Insert user with encrypted SSN
user = User(
    id='123',
    email='alice@example.com',
    ssn_encrypted=encryptor.encrypt('123-45-6789')
)
session.add(user)
session.commit()

# Query and decrypt
user = session.query(User).filter_by(email='alice@example.com').first()
plaintext_ssn = encryptor.decrypt(user.ssn_encrypted)
print(f"SSN: {plaintext_ssn}")
```

**Searchable encryption (deterministic):**
```python
import hashlib
import hmac

def deterministic_encrypt(plaintext, key):
    """
    Generate deterministic ciphertext (same input = same output).
    Allows equality queries, but leaks that two records have same value.
    """
    # HMAC-SHA256 as deterministic "encryption"
    return hmac.new(key, plaintext.encode(), hashlib.sha256).hexdigest()

# Encrypt
email_hash = deterministic_encrypt('alice@example.com', secret_key)

# Store hash instead of plaintext
db.execute("INSERT INTO users (email_hash) VALUES (?)", (email_hash,))

# Query by hash
query_hash = deterministic_encrypt('alice@example.com', secret_key)
user = db.query("SELECT * FROM users WHERE email_hash = ?", (query_hash,))
```

**Warning:** Deterministic encryption leaks information. Use only when necessary for querying.

## Security Considerations

### Encryption != Security

**Common misconceptions:**

**❌ "We encrypted the database, so we're secure."**
- If application is compromised, attacker gets decrypted data
- SQL injection still works (app decrypts data for attacker)

**❌ "The data is encrypted at rest, so backups are safe."**
- Only if keys aren't in the backup
- Only if backup media is also encrypted

**❌ "Full disk encryption protects against all attacks."**
- Only protects against offline attacks (stolen disk)
- Doesn't protect against online attacks (while OS is running)
- Doesn't protect against memory dumps (encrypted disk is decrypted in RAM)

**✅ Encryption at rest protects against:**
- Physical theft (laptop stolen, hard drive removed)
- Unauthorized storage access (cloud provider employee, data center staff)
- Improper disposal (throwing away unwiped drives)
- Backup theft

**✅ Encryption at rest does NOT protect against:**
- Application vulnerabilities (SQL injection, RCE)
- Authorized user abuse (DBA reading database)
- Memory attacks (cold boot, DMA attacks)
- Key compromise

### Protect Your Keys

**The weakest link in encryption at rest is almost always key management.**

**Bad:**
```
Encrypted data: SECURE
Encryption key: Stored in /var/secrets/key.txt on same server
→ Attacker compromises server → reads key file → decrypts data
```

**Good:**
```
Encrypted data: On disk
Encryption key: In AWS KMS (separate service, separate IAM permissions)
→ Attacker compromises server → tries to decrypt → denied (no KMS permissions)
```

**Best practices:**
- Store keys separately from data
- Use KMS/HSM for production
- Rotate keys regularly
- Audit key access (who decrypted what when)
- Restrict key access (principle of least privilege)

### Performance Considerations

**Encryption has overhead:**

| Method | Performance Impact | Typical Use Case |
|--------|-------------------|------------------|
| Full Disk Encryption | 5-10% (negligible with AES-NI) | Laptops, servers |
| Database TDE | 5-15% (depends on workload) | Large databases |
| Application-level | Variable (code complexity) | Fine-grained control |
| File encryption | Per-file overhead | Selective encryption |

**Modern CPUs have AES-NI (AES acceleration):**
- Intel: Since 2010 (Westmere)
- AMD: Since 2010 (Bulldozer)
- ARM: Since ARMv8 (2011)

With AES-NI, encryption overhead is minimal (< 5%).

**Without AES-NI:** 30-50% performance penalty (avoid if possible).

### Cold Boot Attacks

**The threat:**
- RAM retains data for seconds/minutes after power loss
- Attacker freezes RAM with liquid nitrogen → removes → reads decryption keys

**Mitigations:**
- Use TPM (Trusted Platform Module) to seal keys
- Enable secure boot
- Overwrite RAM on shutdown (tpm-luks on Linux)
- Physical security (prevent unauthorized access)

**Reality check:** This is a sophisticated attack requiring physical access. For most threat models, it's not a concern.

### Don't Forget Backups

**Common mistake:**
```
Production database: Encrypted with TDE
Backup files: Stored unencrypted on NAS

→ Attacker steals backup → reads all data
```

**Fix:**
- Encrypt backups with same or higher protection
- Store backup encryption keys separately
- Test backup restoration (encrypted backups you can't restore are worthless)

## Common Pitfalls

### Key in Environment Variable

**Problem:**
```bash
export ENCRYPTION_KEY="super_secret_key"
./app
```

**Risk:**
- Visible in process list (`ps aux | grep ENCRYPTION_KEY`)
- Logged by shell history
- Leaked in crash dumps
- Exposed to all processes run by same user

**Fix:**
- Use KMS/HSM
- If environment variable is necessary, use secret management (AWS Secrets Manager, HashiCorp Vault)

### Encrypting But Not Authenticating

**Problem:**
```python
# Encrypt data
ciphertext = aes_encrypt(plaintext, key)

# Attacker modifies ciphertext (bit flipping attack)
# Decryption produces corrupted plaintext (but no error)
```

**Fix:** Use authenticated encryption (AES-GCM, ChaCha20-Poly1305)
```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

aesgcm = AESGCM(key)
ciphertext = aesgcm.encrypt(nonce, plaintext, associated_data)

# Decryption fails if ciphertext was tampered with
plaintext = aesgcm.decrypt(nonce, ciphertext, associated_data)
# Raises InvalidTag if tampered
```

### Weak Key Derivation from Password

**Problem:**
```python
# Derive encryption key from password (BAD)
key = hashlib.sha256(password.encode()).digest()

# Fast hash → easy to brute force
```

**Fix:** Use proper key derivation function (PBKDF2, scrypt, argon2)
```python
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,  # Random, store with ciphertext
    iterations=100000  # High cost (slow brute force)
)
key = kdf.derive(password.encode())
```

### Not Testing Recovery

**Problem:** Encrypt everything, lose key → data permanently lost

**Reality:** This happens more often than breaches.

**Fix:**
- Document recovery procedures
- Test key recovery regularly
- Have key backup strategy (key escrow, split keys)
- For BitLocker: SAVE THE RECOVERY KEY!

## See Also

- [[Encryption in Transit]]
- [[Symmetric Encryption]]
- [[Key Management]]
- [[Full Disk Encryption]]
- [[Database Encryption]]
- [[Hardware Security Module]]
- [[Key Derivation Functions]]

## References

- [NIST SP 800-111: Guide to Storage Encryption Technologies](https://csrc.nist.gov/publications/detail/sp/800-111/final)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [LUKS (Linux Unified Key Setup) Specification](https://gitlab.com/cryptsetup/LUKS2-docs)
- [AWS KMS Best Practices](https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html)
- [Microsoft BitLocker Documentation](https://docs.microsoft.com/en-us/windows/security/information-protection/bitlocker/bitlocker-overview)
- [Apple FileVault Documentation](https://support.apple.com/guide/mac-help/protect-data-on-your-mac-with-filevault-mh11785/)
- [FIPS 140-2/3: Security Requirements for Cryptographic Modules](https://csrc.nist.gov/publications/detail/fips/140/3/final)
