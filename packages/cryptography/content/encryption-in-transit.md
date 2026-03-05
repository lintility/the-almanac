---
title: Encryption in Transit
chapter: cryptography
type: concept
difficulty: intermediate
prerequisites:
  - "[[Symmetric Encryption]]"
  - "[[Asymmetric Encryption]]"
  - "[[Hash Functions]]"
related:
  - "[[Encryption at Rest]]"
  - "[[TLS]]"
  - "[[Certificates]]"
  - "[[Man-in-the-Middle Attacks]]"
tags:
  - cryptography
  - encryption
  - network-security
  - tls
status: published
created: "2026-02-16"
updated: "2026-02-16"
author: Almanac Bot
---

# Encryption in Transit

## Overview

Encryption in transit protects data while it moves across networks—from your browser to a web server, between microservices, or over the internet. Without it, anyone on the network path can intercept and read your data.

Think of it like sending a postcard vs. sending a sealed letter. A postcard (unencrypted HTTP) can be read by anyone who handles it. A sealed letter (HTTPS with TLS) can only be opened by the intended recipient.

**The key insight:** Your data passes through dozens of routers, switches, ISPs, and network segments between you and the destination. Encryption in transit ensures that even if an attacker controls one of those hops, they can't read or tamper with your data.

## Core Concept

Encryption in transit addresses three security goals:

### 1. Confidentiality
**Prevent eavesdropping on the communication.**

Without encryption:
```
User → "password=hunter2" → ISP → Router → Server
         ↑ Anyone on the path can read this
```

With encryption:
```
User → "gHj8kL...mZ3qR" → ISP → Router → Server
         ↑ Gibberish to anyone except the server
```

### 2. Integrity
**Detect if the message was tampered with in transit.**

Without encryption:
```
Attacker intercepts: "transfer $100 to account 123"
Modifies to:         "transfer $10000 to account 999"
Server receives modified request ← FRAUD
```

With TLS:
```
Server checks HMAC signature
Detects tampering → Rejects request
```

### 3. Authentication
**Verify you're talking to the legitimate server (not an imposter).**

Without encryption:
```
User thinks: "I'm connected to bank.com"
Reality: Connected to attacker's fake site (DNS spoofing, rogue WiFi)
```

With TLS certificates:
```
Server presents certificate signed by trusted CA
Browser verifies: "This is really bank.com"
```

## How TLS Works: The Handshake

**TLS (Transport Layer Security)** is the protocol that powers HTTPS, encrypted email, VPNs, and most modern encrypted communication.

### TLS 1.3 Handshake (Simplified)

```
1. Client Hello
   Client → Server: "I support these ciphers: [TLS_AES_128_GCM_SHA256, ...]"
   
2. Server Hello + Certificate
   Server → Client: "Let's use TLS_AES_128_GCM_SHA256"
                    "Here's my certificate (signed by Trusted CA)"
                    
3. Client Verifies Certificate
   Client checks:
   - Is this certificate valid? (not expired, not revoked)
   - Is it for the domain I'm connecting to? (bank.com)
   - Is it signed by a trusted CA? (Let's Encrypt, DigiCert, etc.)
   
4. Key Exchange (Diffie-Hellman)
   Client + Server: Generate shared secret key (even though packets are observed)
   
5. Encrypted Communication Begins
   All subsequent messages encrypted with the shared secret
```

**Key properties:**
- **Perfect Forward Secrecy (PFS):** Even if the server's private key is later stolen, past communications remain secure
- **One roundtrip:** TLS 1.3 completes the handshake in 1-RTT (TLS 1.2 required 2-RTT)
- **Encrypted handshake:** Most of the handshake is encrypted (prevents metadata leakage)

### TLS 1.2 vs TLS 1.3

| Feature | TLS 1.2 | TLS 1.3 |
|---------|---------|---------|
| Handshake speed | 2 roundtrips | 1 roundtrip |
| Perfect Forward Secrecy | Optional (depends on cipher) | **Mandatory** |
| Weak ciphers | Still supported (RSA, 3DES, RC4) | **Removed** |
| Encrypted handshake | Partial | **Full** |
| Security | Good (if configured properly) | **Better** (secure by default) |

**Bottom line:** Use TLS 1.3 if possible. If you must support legacy clients, use TLS 1.2 with strong cipher suites only.

## Common Protocols for Encryption in Transit

### HTTPS (HTTP over TLS)
**The most common use case.**

```
http://example.com   → Port 80, unencrypted (NEVER use for sensitive data)
https://example.com  → Port 443, encrypted with TLS
```

**How it works:**
1. Browser initiates TLS handshake
2. Server presents certificate
3. Browser verifies certificate
4. Establish encrypted tunnel
5. HTTP traffic flows through the tunnel

**Best practices:**
- Redirect all HTTP to HTTPS (301 permanent redirect)
- Use HSTS (HTTP Strict Transport Security) to force HTTPS
- Obtain certificates from Let's Encrypt (free, automated)

### SSH (Secure Shell)
**Encrypted remote access to servers.**

```bash
# Unencrypted (NEVER do this):
telnet server.com

# Encrypted (use this):
ssh user@server.com
```

**How it works:**
- Uses public key cryptography for authentication
- Encrypts all terminal traffic (commands + output)
- Can tunnel other protocols (port forwarding)

**Common uses:**
- Remote server administration
- Git over SSH (`git clone git@github.com:user/repo.git`)
- SFTP (encrypted file transfer)
- SSH tunnels for database access

### VPNs (Virtual Private Networks)

**Types:**

**IPsec:** Network-layer VPN
- Encrypts IP packets
- Used for site-to-site connections
- Complex to configure

**WireGuard:** Modern, fast VPN
- ~4000 lines of code (vs. 400,000 for OpenVPN/IPsec)
- Uses modern cryptography (Curve25519, ChaCha20)
- Much faster than legacy VPNs

**OpenVPN:** Application-layer VPN
- Widely supported
- Runs over UDP or TCP
- Easier to configure than IPsec

**Use cases:**
- Remote access to corporate network
- Encrypting traffic on public WiFi
- Bypassing geographic restrictions

### mTLS (Mutual TLS)
**Both client and server present certificates.**

Normal TLS:
```
Client verifies server's certificate → Server authenticated
Client sends username/password → Client authenticated
```

mTLS:
```
Client verifies server's certificate → Server authenticated
Server verifies client's certificate → Client authenticated (no password needed)
```

**Common uses:**
- Microservice authentication (service-to-service)
- API authentication (instead of API keys)
- Zero Trust networks
- IoT device authentication

### QUIC (HTTP/3)
**Next-generation transport protocol.**

- Replaces TCP + TLS with UDP + built-in encryption
- Faster connection establishment (0-RTT for returning clients)
- Better performance on lossy networks (mobile)
- Used by HTTP/3

## Certificate Management

### Certificate Authorities (CAs)

A **Certificate Authority** is a trusted third party that signs certificates, vouching for the identity of the certificate holder.

**Trusted CAs** (browsers trust these by default):
- Let's Encrypt (free, automated)
- DigiCert
- GlobalSign
- Sectigo
- AWS Certificate Manager (ACM)

**How it works:**
```
1. You generate a Certificate Signing Request (CSR)
2. CA verifies you own the domain (DNS challenge, HTTP challenge, or email)
3. CA signs your certificate with their private key
4. Browsers trust the CA's root certificate
5. Therefore, browsers trust your certificate
```

### Let's Encrypt (Free Automated Certificates)

**Benefits:**
- Completely free
- Automated issuance and renewal (ACME protocol)
- 90-day certificates (encourages automation)
- Supports wildcard certificates

**Setup with Certbot:**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate (automatically configures nginx)
sudo certbot --nginx -d example.com -d www.example.com

# Certbot automatically:
# 1. Generates CSR
# 2. Proves domain ownership (HTTP-01 challenge)
# 3. Obtains certificate
# 4. Configures nginx to use it
# 5. Sets up auto-renewal (cron job)

# Test auto-renewal
sudo certbot renew --dry-run
```

**ACME protocol:** Automated Certificate Management Environment
- Standardized protocol for certificate issuance
- Enables zero-touch certificate management
- Industry is moving to 47-day certificates (down from 90 days → forces automation)

### Certificate Expiration

**Common certificate lifetimes:**
- **Let's Encrypt:** 90 days (auto-renewal at 60 days)
- **Commercial CAs:** Historically 1-2 years, now 398 days maximum (CA/Browser Forum rule)
- **Internal CAs:** Whatever you configure
- **Future trend:** Moving to 45-47 days (Let's Encrypt announced for 2027)

**Why shorter is better:**
- Limits damage from compromised keys
- Forces automation (reduces human error)
- Reduces reliance on revocation (CRL/OCSP)

**Monitoring expiration:**
```bash
# Check certificate expiration
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | \
openssl x509 -noout -dates

# Output:
# notBefore=Jan 15 00:00:00 2024 GMT
# notAfter=Apr 15 23:59:59 2024 GMT
```

**Automation:**
- Use cert-manager (Kubernetes)
- Use AWS ACM (auto-renewal for AWS-hosted services)
- Use certbot with systemd timers (Linux)

### Certificate Revocation

**What if a certificate's private key is stolen?**

**Methods:**

**CRL (Certificate Revocation List):**
- Published list of revoked certificates
- Client downloads and checks
- Problem: Large lists, infrequent updates

**OCSP (Online Certificate Status Protocol):**
- Client asks CA: "Is cert X still valid?"
- Real-time check
- Problem: Privacy leak (CA knows which sites you visit)

**OCSP Stapling:**
- Server asks CA for OCSP response
- Server includes it in TLS handshake
- Client doesn't contact CA directly
- Better privacy, better performance

**Current trend:** Moving away from OCSP entirely
- Let's Encrypt removed OCSP in 2025
- Short-lived certificates (45 days) reduce need for revocation
- If cert compromised, just wait 45 days for it to expire

### Certificate Pinning

**Problem:** What if a rogue CA issues a fraudulent certificate for your domain?

**Solution:** Pin the expected certificate or public key in your app.

```swift
// iOS example: Pin public key
let serverPublicKey = "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="

// If certificate changes, app rejects connection
if presentedKey != serverPublicKey {
    abort()
}
```

**Risks:**
- If you lose your private key, all pinned clients are bricked
- Certificate rotation is difficult (need to update app)

**Best practice:**
- Pin intermediate CA instead of leaf certificate (allows cert rotation)
- Have a backup pin
- Use certificate transparency logs instead (less risky)

## Implementation Examples

### Nginx TLS Configuration (Best Practices)

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # Certificate paths (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Only allow TLS 1.2 and 1.3
    ssl_protocols TLSv1.2 TLSv1.3;

    # Strong ciphers only (prioritize TLS 1.3)
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # Diffie-Hellman parameters for PFS
    ssl_dhparam /etc/ssl/certs/dhparam.pem;

    # Enable OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # HSTS: Force HTTPS for 1 year
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Prevent clickjacking
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Disable content sniffing
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### Python Requests with TLS Verification

```python
import requests

# ✅ GOOD: Verify TLS certificate (default)
response = requests.get("https://api.example.com/data")

# ❌ DANGEROUS: Disable verification (NEVER do this in production)
response = requests.get("https://api.example.com/data", verify=False)
# Vulnerable to man-in-the-middle attacks

# ✅ Pin specific CA certificate
response = requests.get(
    "https://api.example.com/data",
    verify="/path/to/ca-bundle.crt"
)

# ✅ mTLS: Provide client certificate
response = requests.get(
    "https://api.example.com/data",
    cert=("/path/to/client.crt", "/path/to/client.key")
)
```

### SSH Tunnel for Encrypted Database Access

```bash
# Problem: Database doesn't support TLS
# Solution: SSH tunnel

# Create tunnel: localhost:5433 → database-server:5432 (via jump-host)
ssh -L 5433:database-server:5432 user@jump-host -N

# Now connect to localhost:5433 (traffic encrypted via SSH)
psql -h localhost -p 5433 -U dbuser -d production

# The connection path:
# psql → localhost:5433 → SSH tunnel → jump-host → database-server:5432
#                          ↑ This part is encrypted
```

### WireGuard VPN Setup

**Server configuration:**
```ini
[Interface]
PrivateKey = <server_private_key>
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
PublicKey = <client_public_key>
AllowedIPs = 10.0.0.2/32
```

**Client configuration:**
```ini
[Interface]
PrivateKey = <client_private_key>
Address = 10.0.0.2/24

[Peer]
PublicKey = <server_public_key>
Endpoint = vpn.example.com:51820
AllowedIPs = 0.0.0.0/0  # Route all traffic through VPN
PersistentKeepalive = 25
```

**Activate:**
```bash
# Server
wg-quick up wg0

# Client
wg-quick up wg0
# All traffic now encrypted through VPN tunnel
```

## Security Considerations

### Use TLS 1.3 (or at least TLS 1.2)

**❌ Never use:**
- SSL 2.0 / SSL 3.0 (completely broken)
- TLS 1.0 (deprecated, PCI DSS forbids it)
- TLS 1.1 (deprecated)

**✅ Use:**
- TLS 1.3 (best, mandatory PFS)
- TLS 1.2 (acceptable, but configure carefully)

### Disable Weak Ciphers

**Weak ciphers to disable:**
- RC4 (broken)
- 3DES (64-bit block size → SWEET32 attack)
- MD5-based ciphers (collision attacks)
- NULL ciphers (no encryption!)
- EXPORT ciphers (intentionally weakened for legacy US export laws)

**Use Mozilla's SSL Configuration Generator:**
https://ssl-config.mozilla.org/

### Enforce HSTS (HTTP Strict Transport Security)

**Problem:** User types `bank.com` → Browser tries HTTP first → Redirects to HTTPS
- Attacker can intercept that first HTTP request (SSL stripping attack)

**Solution:** HSTS header tells browser: "Only use HTTPS for the next year"

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**HSTS Preload List:**
- Browsers ship with a hardcoded list of domains that MUST use HTTPS
- Submit your domain: https://hstspreload.org/
- Once on the list, browsers NEVER try HTTP (even on first visit)

### Perfect Forward Secrecy (PFS)

**Problem:** Server's private key is stolen 2 years later. Can attacker decrypt past traffic?

**Without PFS (RSA key exchange):**
- Attacker recorded all encrypted traffic
- Steals server's RSA private key
- Decrypts ALL past sessions ❌

**With PFS (Diffie-Hellman key exchange):**
- Each session uses a unique ephemeral key
- Even if server's private key is stolen, past sessions are safe ✅

**How to enable:**
- TLS 1.3: PFS mandatory (all cipher suites use DH)
- TLS 1.2: Use ECDHE or DHE cipher suites (avoid RSA key exchange)

```nginx
# TLS 1.2 with PFS
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
```

### Validate Certificates Properly

**❌ Common mistakes:**

```python
# Disabling verification
requests.get(url, verify=False)  # NEVER!

# Accepting self-signed certs in production
curl -k https://example.com  # -k = --insecure (bad!)
```

**✅ Proper validation:**
- Verify certificate is signed by trusted CA
- Verify certificate is for the domain you're connecting to
- Verify certificate is not expired
- Check certificate revocation status (OCSP)

## Common Pitfalls

### Mixed Content (HTTPS Page Loading HTTP Resources)

**Problem:**
```html
<!-- Page loaded via HTTPS -->
<script src="http://cdn.example.com/script.js"></script>
<!-- Script loaded via HTTP → can be intercepted and modified -->
```

**Browsers block mixed content by default (active content like scripts).** Passive content (images) might load but triggers a warning.

**Fix:** Use HTTPS for ALL resources, or use protocol-relative URLs:
```html
<script src="//cdn.example.com/script.js"></script>
<!-- Uses same protocol as parent page -->
```

### Man-in-the-Middle (MitM) Attacks

**Attack scenarios:**

**Rogue WiFi Hotspot:**
```
User connects to "Free Airport WiFi"
→ Attacker intercepts all traffic
→ Presents fake certificate for bank.com
→ User's browser should reject (untrusted CA)
→ But user clicks "Accept anyway" 😱
```

**DNS Spoofing:**
```
Attacker poisons DNS cache
bank.com → 192.0.2.123 (attacker's server)
User connects to fake site with self-signed cert
```

**Mitigations:**
- Certificate validation (don't click "Proceed anyway")
- HSTS prevents downgrade to HTTP
- Certificate pinning (for critical apps)

### Certificate Mismatch Errors

**Common causes:**

```
Certificate is for: example.com
User visiting: www.example.com
→ MISMATCH

Certificate is for: *.example.com
User visiting: sub.domain.example.com
→ MISMATCH (wildcard only covers one level)
```

**Solutions:**
- Use Subject Alternative Names (SAN) to list multiple domains
- Use wildcard certificates (`*.example.com`)
- Get separate certificates for each subdomain

### Expired Certificates

**Result:** Browsers show scary warnings, users can't connect.

**Prevention:**
- Automated renewal (certbot, ACM, cert-manager)
- Monitoring (alert 30 days before expiration)
- Redundant certificates (have a backup ready)

**When expiration happens:**
```bash
# Emergency renewal
sudo certbot renew --force-renewal

# Or obtain new cert manually
sudo certbot certonly --standalone -d example.com
```

## Testing & Validation

**Online tools:**
- **SSL Labs:** https://www.ssllabs.com/ssltest/ (most comprehensive)
- **Mozilla Observatory:** https://observatory.mozilla.org/
- **Hardenize:** https://www.hardenize.com/

**Command-line tools:**
```bash
# Test TLS connection
openssl s_client -connect example.com:443 -servername example.com

# Check certificate details
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -text

# Test specific TLS version
openssl s_client -connect example.com:443 -tls1_2

# Check cipher suites
nmap --script ssl-enum-ciphers -p 443 example.com
```

## See Also

- [[Encryption at Rest]]
- [[TLS]]
- [[Certificates]]
- [[Public Key Infrastructure]]
- [[Man-in-the-Middle Attacks]]
- [[VPNs]]
- [[SSH]]

## References

- [RFC 8446: TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
- [OWASP Transport Layer Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [NIST SP 800-52r2: TLS Guidelines](https://csrc.nist.gov/publications/detail/sp/800-52/rev-2/final)
- [SSL Labs: SSL/TLS Best Practices](https://github.com/ssllabs/research/wiki/SSL-and-TLS-Deployment-Best-Practices)
- [WireGuard Whitepaper](https://www.wireguard.com/papers/wireguard.pdf)
