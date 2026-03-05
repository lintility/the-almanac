---
title: Authorization
chapter: security
type: concept
difficulty: beginner
prerequisites:
  - "[[Authentication]]"
related:
  - "[[Role-Based Access Control]]"
  - "[[Access Control Lists]]"
  - "[[Principle of Least Privilege]]"
tags:
  - security
  - access-control
  - authorization
  - permissions
status: published
created: "2026-02-16"
updated: "2026-02-16"
author: Almanac Bot
---

# Authorization

## Overview

Authorization determines what an authenticated user is allowed to do. While [[Authentication]] verifies *who you are*, authorization controls *what you can access*.

Think of it like this: your driver's license authenticates your identity, but authorization determines which vehicles you're permitted to drive. You might be authorized for a sedan but not a commercial truck, even though both organizations verified your identity.

**The golden rule:** Authentication happens once (at login). Authorization happens every time you try to access a resource.

## Core Concept

Authorization answers the question: **"What are you allowed to do?"**

The process involves three key elements:

**Subject** (Who)
- The entity requesting access (user, service, application)
- Often represented by a user ID, session token, or service account

**Object** (What)
- The resource being accessed (file, database record, API endpoint, feature)
- Could be a specific item (`/documents/invoice-1234`) or a category (`all invoices`)

**Action** (How)
- The operation being performed (`read`, `write`, `delete`, `execute`)
- Sometimes called permissions or privileges

Authorization policies define rules like:
- "Sales representatives can **read** customer records"
- "Managers can **approve** purchase orders under $10,000"
- "Only document owners can **delete** their documents"

## Authorization Models

### Discretionary Access Control (DAC)

Resource owners control who can access their resources. Think filesystem permissions on Linux/Windows—you own a file, you decide who can read or write it.

**Strengths:**
- Flexible (owners make their own decisions)
- Simple to understand (owner = controller)
- User-friendly for collaborative environments

**Weaknesses:**
- Decentralized (hard to audit organization-wide)
- Information can leak (users might overshare)
- Not suitable for high-security environments

**Example:** Google Drive—you own a document, you share it with specific people.

### Mandatory Access Control (MAC)

A central authority defines access policies based on security labels. Users can't override these rules even if they "own" the resource.

**Strengths:**
- High security (enforced by the system, not users)
- Prevents data leakage (users can't accidentally share classified data)
- Good for military, government, regulated industries

**Weaknesses:**
- Rigid (hard to accommodate exceptions)
- Complex to administer
- Poor user experience (can't share files easily)

**Example:** Military systems with "Top Secret," "Secret," "Confidential" classifications.

### Role-Based Access Control (RBAC)

Permissions are assigned to roles, and users are assigned to roles. Most common model in enterprise applications.

**How it works:**
```
User → Role → Permissions → Resources

Example:
Alice → "Sales Rep" role → "read customer data" → Customer database
Bob → "Sales Manager" role → "read + write customer data" → Customer database
```

**Strengths:**
- Easy to manage at scale (change role permissions once, affects all users in that role)
- Aligns with organizational structure (job titles map to roles)
- Reduces administrative overhead

**Weaknesses:**
- Role explosion (too many roles for fine-grained control)
- Doesn't handle dynamic conditions well ("only during business hours")
- Can lead to over-privileging (users get role permissions they don't need)

**When to use:** Most business applications, especially with clear organizational hierarchies.

### Attribute-Based Access Control (ABAC)

Access decisions based on attributes of the subject, object, action, and environment. Highly dynamic and context-aware.

**Attributes can include:**
- **Subject:** department, clearance level, employment status
- **Object:** classification, owner, creation date
- **Action:** read, write, delete, approve
- **Environment:** time of day, location, IP address, device security posture

**Policy example:**
```
ALLOW if:
  subject.department == "Finance" AND
  object.type == "financial_report" AND
  action == "read" AND
  environment.time >= 08:00 AND
  environment.time <= 18:00 AND
  environment.location == "office_network"
```

**Strengths:**
- Very flexible (handles complex, dynamic scenarios)
- Fine-grained control
- Reduces role explosion

**Weaknesses:**
- Complex to design and implement
- Harder to audit ("why was this denied?")
- Performance overhead (evaluating many attributes)

**When to use:** Complex environments with dynamic requirements (healthcare, finance, defense).

### Relationship-Based Access Control (ReBAC)

Access based on relationships between entities in a graph. Inspired by Google Zanzibar.

**How it works:**
- Model resources and users as a graph
- Define relationships: `Alice owns Document-123`, `Bob is member of Team-Sales`
- Check transitive relationships: "Can Alice view this doc?" → "Is Alice the owner OR in a group that has viewer access?"

**Strengths:**
- Natural for hierarchical/nested structures (organizations, folder hierarchies)
- Handles sharing and delegation elegantly
- Scales to billions of relationships (Zanzibar powers Google Drive, Gmail, Calendar)

**Weaknesses:**
- Requires graph database or specialized engine
- More complex than RBAC
- Debugging authorization issues is harder

**When to use:** Collaborative platforms, file sharing, social networks, anything with complex sharing/delegation patterns.

## Implementation Examples

### RBAC in Python (Flask + SQLAlchemy)

```python
from functools import wraps
from flask import abort, g

# Define roles and permissions
ROLE_PERMISSIONS = {
    "admin": ["read", "write", "delete", "admin"],
    "editor": ["read", "write"],
    "viewer": ["read"]
}

# Decorator to check permissions
def require_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = g.current_user  # Authenticated user from session
            
            if not user:
                abort(401)  # Not authenticated
            
            user_permissions = ROLE_PERMISSIONS.get(user.role, [])
            
            if permission not in user_permissions:
                abort(403)  # Authenticated but not authorized
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Usage in routes
@app.route('/documents/<int:doc_id>', methods=['DELETE'])
@require_permission("delete")
def delete_document(doc_id):
    # User is authorized to delete, proceed
    document = Document.query.get_or_404(doc_id)
    db.session.delete(document)
    db.session.commit()
    return {"message": "Document deleted"}
```

### ABAC with Open Policy Agent (OPA)

**Policy file (Rego language):**
```rego
package document.authz

# Allow read access if user's department matches document department
# and current time is during business hours
allow {
    input.action == "read"
    input.user.department == input.document.department
    business_hours
}

# Allow write access only for document owners
allow {
    input.action == "write"
    input.user.id == input.document.owner_id
}

business_hours {
    time.now_ns() >= time.parse_rfc3339_ns("08:00:00Z")
    time.now_ns() <= time.parse_rfc3339_ns("18:00:00Z")
}
```

**Application code (Python):**
```python
import requests

def check_authorization(user, document, action):
    # Query OPA decision endpoint
    policy_input = {
        "input": {
            "user": {
                "id": user.id,
                "department": user.department
            },
            "document": {
                "id": document.id,
                "department": document.department,
                "owner_id": document.owner_id
            },
            "action": action
        }
    }
    
    response = requests.post(
        "http://opa:8181/v1/data/document/authz/allow",
        json=policy_input
    )
    
    result = response.json()
    return result.get("result", False)

# Usage
if check_authorization(current_user, document, "read"):
    return document.content
else:
    abort(403)
```

### Preventing IDOR (Insecure Direct Object Reference)

**❌ Vulnerable code:**
```python
@app.route('/api/invoices/<int:invoice_id>')
def get_invoice(invoice_id):
    # DANGEROUS: No authorization check!
    invoice = Invoice.query.get_or_404(invoice_id)
    return jsonify(invoice.to_dict())

# Attacker can access ANY invoice by changing the ID:
# /api/invoices/1, /api/invoices/2, /api/invoices/3 ...
```

**✅ Secure code:**
```python
@app.route('/api/invoices/<int:invoice_id>')
def get_invoice(invoice_id):
    user = g.current_user
    invoice = Invoice.query.get_or_404(invoice_id)
    
    # Authorization check: User must own this invoice
    if invoice.customer_id != user.customer_id:
        abort(403)  # Forbidden
    
    return jsonify(invoice.to_dict())
```

**Even better—scope queries by user:**
```python
@app.route('/api/invoices/<int:invoice_id>')
def get_invoice(invoice_id):
    user = g.current_user
    
    # Query scoped to current user's resources
    invoice = Invoice.query.filter_by(
        id=invoice_id,
        customer_id=user.customer_id
    ).first_or_404()
    
    return jsonify(invoice.to_dict())
```

### Google Zanzibar-Style ReBAC

**Relationships stored in a tuple format:**
```
(object, relation, subject)

Examples:
("doc:readme.md", "owner", "user:alice")
("doc:readme.md", "viewer", "group:engineering")
("group:engineering", "member", "user:bob")
```

**Check authorization:**
```
Question: Can user:bob view doc:readme.md?

Evaluation:
1. Is user:bob directly a viewer of doc:readme.md? → No
2. Is user:bob a member of any group that is a viewer? 
   → user:bob is member of group:engineering
   → group:engineering is viewer of doc:readme.md
   → YES, authorized
```

**Implementation with SpiceDB (open-source Zanzibar):**
```python
from authzed.api.v1 import Client

client = Client("grpc.authzed.com:443", token)

# Check permission
response = client.CheckPermission(
    resource={"object_type": "document", "object_id": "readme"},
    permission="view",
    subject={"object_type": "user", "object_id": "bob"}
)

if response.permissionship == Permissionship.PERMISSIONSHIP_HAS_PERMISSION:
    return "Authorized"
```

## Security Considerations

### Principle of Least Privilege

**Grant users the minimum permissions needed to do their job. Nothing more.**

- Don't assign "admin" role to everyone (even temporarily)
- Scope permissions narrowly (read-only by default)
- Review permissions regularly (privilege creep is real)
- Require justification for elevated access

### Default Deny

**If no rule explicitly allows access, deny it.**

```python
# ❌ Bad: Default allow (implicit)
def is_authorized(user, resource):
    if user.role == "admin":
        return True
    # Missing deny → defaults to allowed!

# ✅ Good: Explicit deny
def is_authorized(user, resource):
    if user.role == "admin":
        return True
    return False  # Explicit default deny
```

### Separation of Duties

**No single person should control an entire critical process.**

Example: In financial systems:
- User A can **create** a payment
- User B can **approve** a payment
- Neither can do both (prevents fraud)

### Check Authorization Server-Side

**NEVER rely on client-side authorization checks.**

```javascript
// ❌ DANGEROUS: Client-side check
if (user.role === "admin") {
    showDeleteButton();
}

// Attacker can bypass by opening console:
// document.getElementById('delete-button').click();
```

**Always enforce authorization on the backend:**
```python
# ✅ Server-side enforcement
@app.route('/api/documents/<id>', methods=['DELETE'])
def delete_document(id):
    if not current_user.has_permission("delete"):
        abort(403)
    # Proceed with deletion
```

### Test Authorization Thoroughly

**Common test cases:**
- User with no permissions tries to access resource → 403
- User with read-only tries to write → 403
- User A tries to access User B's private data → 403 (IDOR)
- User with expired permissions tries to access → 403
- User in role X tries action only allowed for role Y → 403

## Common Pitfalls

### Missing Function-Level Access Control

**Hiding UI elements doesn't secure the API.**

```javascript
// Frontend hides admin panel for non-admins
if (user.role !== "admin") {
    hideAdminPanel();
}

// But the backend API is unprotected!
// Attacker can call: POST /api/admin/delete-user
```

**Fix:** Check permissions on every API endpoint.

### Path Traversal Bypassing ACLs

```python
# Vulnerable: User directory traversal
@app.route('/files/<path:filename>')
def download_file(filename):
    # User uploads to /uploads/{user_id}/
    # Attacker requests: /files/../../../etc/passwd
    return send_file(os.path.join("/uploads", current_user.id, filename))
```

**Fix:** Validate paths, use absolute paths, check authorization.

### Privilege Escalation

**Horizontal:** Access another user's resources (IDOR)
```
GET /api/orders/123  # Your order
GET /api/orders/124  # Someone else's order ← unauthorized!
```

**Vertical:** Perform actions above your privilege level
```
POST /api/admin/promote-user  # Regular user calling admin endpoint
```

**Fix:** Check both identity (is this YOUR resource?) and permissions (can your role do this action?).

### Insecure Direct Object References (IDOR)

**The #1 authorization vulnerability.**

Predictable IDs + missing checks = full data breach.

```python
# Vulnerable
@app.route('/profile/<user_id>')
def profile(user_id):
    user = User.query.get(user_id)
    return render_template('profile.html', user=user)

# Attacker iterates: /profile/1, /profile/2, /profile/3...
```

**Mitigations:**
- Always check ownership: `if resource.owner_id != current_user.id: abort(403)`
- Use UUIDs instead of sequential IDs (doesn't replace auth checks!)
- Scope queries: `Resource.query.filter_by(owner=current_user)`

### Session Riding / CSRF

Authenticated user's browser makes unauthorized requests.

**Attack:**
```html
<!-- Attacker's malicious website -->
<img src="https://bank.com/api/transfer?to=attacker&amount=10000">
<!-- User's authenticated session cookie is sent automatically! -->
```

**Fix:** Use CSRF tokens, SameSite cookies, check Origin/Referer headers.

## When to Use Each Model

| Model | Best For | Avoid For |
|-------|----------|-----------|
| **DAC** | File sharing, collaborative docs | Regulated industries, classified data |
| **MAC** | Military, government, classified systems | General business apps (too rigid) |
| **RBAC** | Enterprise apps, clear org structure | Dynamic conditions, complex sharing |
| **ABAC** | Healthcare, finance, dynamic policies | Simple apps (overkill) |
| **ReBAC** | Social networks, file sharing, nested orgs | Simple permissions (complexity not needed) |

**General guidance:**
- Start with RBAC for most business apps
- Add ABAC rules for edge cases (time-based, location-based)
- Use ReBAC if sharing/delegation is a core feature
- Avoid MAC unless you're in a regulated/classified environment

## Modern Authorization Tools

**Policy Engines:**
- **Open Policy Agent (OPA)** — General-purpose policy engine, Rego language
- **AWS Cedar** — Amazon's policy language, used in AWS Verified Permissions
- **Casbin** — Multi-language authorization library

**Zanzibar-Inspired Systems:**
- **SpiceDB** — Open-source Zanzibar implementation
- **Ory Keto** — Cloud-native permissions engine
- **Permify** — Authorization service with ReBAC support

**Commercial Solutions:**
- **Okta** — SSO + authorization
- **Auth0** — Identity + RBAC
- **Permit.io** — Full-stack authorization platform

## See Also

- [[Authentication]]
- [[Role-Based Access Control]]
- [[Access Control Lists]]
- [[Principle of Least Privilege]]
- [[OWASP Top 10]]
- [[Session Management]]
- [[CSRF Protection]]

## References

- [NIST: Authorization Definition](https://csrc.nist.gov/glossary/term/authorization)
- [NIST SP 800-162: Attribute-Based Access Control (ABAC)](https://csrc.nist.gov/publications/detail/sp/800-162/final)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Top 10: Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [OWASP IDOR Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)
- [Google Zanzibar Paper](https://research.google/pubs/pub48190/) (Consistent, Global Authorization System)
- [Open Policy Agent Documentation](https://www.openpolicyagent.org/docs/latest/)
