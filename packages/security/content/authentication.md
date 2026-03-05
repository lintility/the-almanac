---
title: Authentication
chapter: security
type: concept
difficulty: beginner
prerequisites:
  - "[[Identity]]"
related:
  - "[[Authorization]]"
  - "[[Multi-Factor Authentication]]"
  - "[[Single Sign-On]]"
  - "[[Password Security]]"
tags:
  - security
  - identity
  - access-control
  - authentication
status: published
created: "2026-02-16"
updated: "2026-02-16"
author: Almanac Bot
---

# Authentication

## Overview

Authentication is the process of verifying that someone (or something) is who they claim to be. It's the digital equivalent of showing ID—proving your identity before being granted access to a system, application, or resource.

Think of it like the bouncer at a club checking your driver's license. The license proves you are who you say you are, but it doesn't determine which VIP areas you can access—that's [[Authorization]], a separate concept.

## Core Concept

Authentication answers the question: **"Who are you?"**

The process relies on one or more **authentication factors**—pieces of evidence that support your claimed identity. These factors fall into four main categories:

**Something you know** (Knowledge factors)
- Password or passphrase
- PIN (Personal Identification Number)
- Security questions
- Secret pattern

**Something you have** (Possession factors)
- Physical token (YubiKey, smart card)
- Mobile phone (for SMS or authenticator app)
- Security badge or key fob
- Digital certificate

**Something you are** (Inherence factors / Biometrics)
- Fingerprint
- Face recognition
- Iris or retina scan
- Voice recognition
- Behavioral biometrics (typing patterns, gait)

**Somewhere you are** (Location factors)
- IP address geolocation
- GPS coordinates
- Network location (on corporate VPN, inside the building)

The more factors you combine, the stronger the authentication. Using two or more factors is called **Multi-Factor Authentication (MFA)** or **Two-Factor Authentication (2FA)** when exactly two factors are used.

## Common Authentication Methods

### Password-Based Authentication

The most common method. Users present a username and password that the system validates against stored credentials.

**Strengths:**
- Simple to implement
- Users are familiar with the pattern
- No additional hardware required

**Weaknesses:**
- Vulnerable to phishing, brute force, credential stuffing
- Users often choose weak passwords or reuse them
- Storing passwords securely is challenging

### Certificate-Based Authentication

Uses digital certificates (public key cryptography) to verify identity. Common for SSH, VPNs, and mutual TLS (mTLS).

**How it works:**
1. User generates a key pair (private key + public key)
2. Public key is signed by a trusted Certificate Authority (CA) or system
3. During authentication, user proves they possess the private key
4. System verifies the certificate signature

**Strengths:**
- Strong cryptographic proof
- No passwords to steal or guess
- Works well for machine-to-machine authentication

**Weaknesses:**
- More complex setup (PKI infrastructure)
- Certificate management (expiration, revocation)
- Losing private key means losing access

### Biometric Authentication

Uses physical characteristics to verify identity.

**Strengths:**
- Convenient (can't forget your fingerprint)
- Difficult to steal or replicate (when done well)
- Fast authentication experience

**Weaknesses:**
- Privacy concerns (biometric data is sensitive)
- Can't be changed if compromised (you can't get a new fingerprint)
- False positives/negatives
- Requires specialized hardware

### Token-Based Authentication (JWT, OAuth)

After initial authentication, the system issues a token that represents the authenticated session. Commonly used for APIs and microservices.

**How it works:**
1. User authenticates with credentials
2. Server generates a signed token (e.g., JWT - JSON Web Token)
3. Client includes token in subsequent requests
4. Server validates token signature and claims

**Strengths:**
- Stateless (no server-side session storage needed)
- Works well across distributed systems
- Can carry additional claims (roles, permissions)

**Weaknesses:**
- Token theft enables impersonation
- Token revocation is challenging
- Tokens have expiration (need refresh mechanism)

### Single Sign-On (SSO)

Authenticate once, access multiple systems. Common protocols: SAML, OAuth 2.0, OpenID Connect (OIDC).

**Strengths:**
- Better user experience (one login for everything)
- Centralized authentication management
- Easier to enforce MFA organization-wide

**Weaknesses:**
- Single point of failure
- Compromise of SSO account affects all connected systems
- Complex to implement correctly

## How Authentication Works: The Flow

Here's a typical password-based authentication flow:

```
1. User submits username + password
     ↓
2. Server retrieves stored password hash for that username
     ↓
3. Server hashes the submitted password (with same salt)
     ↓
4. Server compares hashes in constant time
     ↓
5. Match? → Generate session/token, grant access
   No match? → Return generic error, log attempt
```

**Critical security detail:** Never reveal whether the username or password was wrong. Always return a generic "Invalid credentials" message to prevent username enumeration attacks.

## Implementation Examples

### Secure Password Verification (Python with bcrypt)

```python
import bcrypt

# Registration: Hash and store password
def register_user(username, password):
    # Generate salt and hash password
    salt = bcrypt.gensalt(rounds=12)  # 12 rounds = good balance
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    # Store username and password_hash in database
    save_to_db(username, password_hash)
    
# Login: Verify password
def authenticate_user(username, password):
    # Retrieve stored hash from database
    stored_hash = get_hash_from_db(username)
    
    if stored_hash is None:
        # User doesn't exist, but don't reveal that!
        # Run bcrypt anyway to prevent timing attacks
        bcrypt.checkpw(password.encode('utf-8'), bcrypt.gensalt())
        return False
    
    # Check password (constant-time comparison)
    if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
        return True
    
    return False
```

**Key points:**
- Use `bcrypt` (or `argon2`) for password hashing, NOT plain SHA-256
- Salt is automatically included in bcrypt's output
- `checkpw()` does constant-time comparison (prevents timing attacks)
- Run hash comparison even if user doesn't exist (prevents user enumeration via timing)

### SSH Key Authentication

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "user@example.com"
# Creates ~/.ssh/id_ed25519 (private) and ~/.ssh/id_ed25519.pub (public)

# Copy public key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server.com

# SSH automatically uses your private key
ssh user@server.com
```

**How it works:**
1. Server has your public key in `~/.ssh/authorized_keys`
2. You prove you have the matching private key via challenge-response
3. No password needed

### JWT Token Authentication (Node.js)

```javascript
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET; // Keep this secret!

// Generate token after successful login
function generateToken(userId) {
  const payload = {
    sub: userId,  // Subject (user ID)
    iat: Math.floor(Date.now() / 1000),  // Issued at
    exp: Math.floor(Date.now() / 1000) + (60 * 60)  // Expires in 1 hour
  };
  
  return jwt.sign(payload, SECRET, { algorithm: 'HS256' });
}

// Verify token on protected routes
function authenticateRequest(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.sub;  // Attach user ID to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### OAuth 2.0 Authorization Code Flow

```
User → Application: "I want to log in with Google"
  ↓
Application → Google: Redirect to Google login page
  ↓
User → Google: Enters credentials
  ↓
Google → Application: Redirect back with authorization code
  ↓
Application → Google: Exchange code for access token (backend)
  ↓
Google → Application: Returns access token + ID token
  ↓
Application: Verify ID token, extract user info, create session
```

This is how "Sign in with Google/GitHub/Facebook" works.

## Security Considerations

### Password Security

**Do:**
- Enforce minimum length (8 chars with MFA, 15 without per NIST SP 800-63B)
- Allow up to 64+ characters (support passphrases)
- Allow all characters (unicode, spaces, special chars)
- Use bcrypt, argon2, or scrypt for hashing
- Check passwords against breach databases (Have I Been Pwned API)
- Implement rate limiting to prevent brute force
- Use constant-time comparison for password checks

**Don't:**
- Store passwords in plaintext (ever!)
- Use fast hashes like MD5 or SHA-256 for passwords
- Require periodic password changes without reason
- Enforce complex password rules (uppercase, special char, etc.) - length matters more
- Truncate passwords silently
- Reveal whether username or password was wrong

### Protect Against Common Attacks

**Brute Force:** Limit login attempts (e.g., 5 failed attempts = 15-minute lockout)

**Credential Stuffing:** Use CAPTCHA or device fingerprinting after suspicious login patterns

**Phishing:** Educate users, implement MFA (makes phished passwords less useful)

**Session Hijacking:** Use secure, HttpOnly, SameSite cookies; rotate session IDs after login

**Timing Attacks:** Always use constant-time comparison for secrets; run authentication logic even if user doesn't exist

### Multi-Factor Authentication is Critical

**Never rely on passwords alone for sensitive systems.** MFA dramatically reduces account compromise risk:
- SMS codes (better than nothing, but vulnerable to SIM swapping)
- Authenticator apps (Google Authenticator, Authy) - Time-based One-Time Passwords (TOTP)
- Hardware tokens (YubiKey, Titan Security Key) - best security
- Push notifications (Duo, Microsoft Authenticator)

## Common Pitfalls

**Missing function-level authentication**
- Protecting the UI but not the API
- Checking authentication only on page load, not on API calls
- Example: Admin panel hidden, but `/api/admin/users` endpoint is unprotected

**Insecure password reset flows**
- Reset links that don't expire
- Security questions with guessable answers
- Sending new passwords via email instead of reset links

**Poor session management**
- Sessions that never expire
- Session IDs in URLs (visible in logs, browser history)
- Not invalidating sessions on logout

**Trusting client-side authentication**
- JavaScript-only login checks (easily bypassed)
- Storing passwords in client-side code
- Example: `if (password === 'admin123') { allow_access(); }`

**Username enumeration**
- Different error messages for "wrong username" vs. "wrong password"
- Different response times based on whether user exists
- Registration page that says "username already taken"

## When to Use Different Methods

**Passwords alone:**
- Low-risk applications
- Internal tools with other controls (VPN, physical access)
- When user convenience is paramount and risk is minimal

**Passwords + MFA:**
- Production systems
- Applications with customer data
- Financial services
- Anything internet-facing

**Certificate-based:**
- Machine-to-machine authentication (APIs, microservices)
- SSH access to servers
- VPN connections
- High-security environments

**SSO (SAML, OIDC):**
- Enterprise environments with many internal apps
- SaaS integrations
- When centralized user management is needed

**Passwordless (WebAuthn, passkeys):**
- Modern web applications
- High-security + great UX
- Phishing-resistant authentication required

## Authentication Protocols

### HTTP Basic Auth
- Sends username:password in Base64 (not encrypted!)
- Only use over HTTPS
- Simple but limited (no logout, credentials sent on every request)
- RFC 7617

### HTTP Digest Auth
- Hashed credentials instead of plaintext
- Better than Basic, but still legacy
- Rarely used in modern apps

### OAuth 2.0
- **Not** an authentication protocol (it's for authorization!)
- Enables "Login with X" when combined with OpenID Connect
- Delegates access without sharing passwords
- RFC 6749

### OpenID Connect (OIDC)
- Authentication layer built on OAuth 2.0
- Returns ID token (JWT) with user info
- Modern standard for SSO
- Used by Google, Microsoft, Okta

### SAML 2.0
- XML-based federation protocol
- Common in enterprise SSO
- More complex than OIDC
- Legacy but still widely used

### Kerberos
- Network authentication protocol (Active Directory uses this)
- Ticket-based authentication
- Mutual authentication (client and server verify each other)
- Designed for local networks

## See Also

- [[Authorization]]
- [[Multi-Factor Authentication]]
- [[Password Security]]
- [[Identity and Access Management]]
- [[Session Management]]
- [[OAuth]]
- [[OpenID Connect]]
- [[SAML]]
- [[Public Key Infrastructure]]

## References

- [NIST SP 800-63B: Digital Identity Guidelines (Authentication)](https://pages.nist.gov/800-63-4/sp800-63b.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [RFC 7617: The 'Basic' HTTP Authentication Scheme](https://datatracker.ietf.org/doc/html/rfc7617)
- [RFC 6749: OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [Have I Been Pwned: Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords)
- [WebAuthn: Web Authentication Standard](https://webauthn.guide/)
