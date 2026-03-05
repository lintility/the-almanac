---
title: Cross-Site Request Forgery (CSRF)
chapter: security
type: vulnerability
difficulty: intermediate
prerequisites:
  - "[[HTTP Basics]]"
  - "[[Session Management]]"
  - "[[Cookies]]"
related:
  - "[[Cross-Site Scripting]]"
  - "[[Authentication]]"
  - "[[Same-Origin Policy]]"
tags:
  - security
  - vulnerabilities
  - owasp-top-10
  - web-security
  - session-attacks
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Cross-Site Request Forgery (CSRF)

## Overview

Cross-Site Request Forgery (CSRF) is an attack that tricks authenticated users into performing unwanted actions on a web application. It exploits the browser's automatic inclusion of credentials (cookies, session tokens) with requests, allowing attackers to make requests that appear to come from legitimate users.

Think of it like someone forging your signature on a check. The bank trusts the signature and processes the transaction, even though you never authorized it.

## Core Concept

CSRF exploits the browser's behavior: **when you visit a malicious website, that site can make requests to other websites, and the browser automatically includes your cookies for those sites.**

If you're logged into your bank and visit a malicious page, that page can submit requests to your bank's website. Because your session cookie is automatically sent, the bank thinks the request came from you.

**The vulnerability exists when**:
1. User is authenticated to a web application (has a valid session)
2. Application performs state-changing operations (transfers, deletions, changes)
3. Application doesn't verify that the request originated from the application itself
4. Attacker can predict or construct a valid request

## Attack Example

**Scenario**: Banking application with this money transfer endpoint:
```
POST /transfer
amount=1000&to_account=987654
```

**Vulnerable implementation** (no CSRF protection):
```python
@app.route('/transfer', methods=['POST'])
def transfer():
    # Check if user is logged in (via session cookie)
    if not session.get('user_id'):
        return redirect('/login')

    amount = request.form['amount']
    to_account = request.form['to_account']

    # Perform transfer
    transfer_money(session['user_id'], to_account, amount)
    return "Transfer complete"
```

**The attack**:

Attacker creates a malicious page:
```html
<html>
<body>
    <h1>You Won a Prize!</h1>
    <p>Click here to claim your reward!</p>

    <!-- Hidden form that auto-submits -->
    <form id="attack" action="https://bank.com/transfer" method="POST">
        <input type="hidden" name="amount" value="10000">
        <input type="hidden" name="to_account" value="attacker_account">
    </form>

    <script>
        // Automatically submit the form
        document.getElementById('attack').submit();
    </script>
</body>
</html>
```

**What happens**:
1. Victim is logged into `bank.com` (has valid session cookie)
2. Victim visits attacker's malicious page
3. The hidden form automatically submits to `bank.com/transfer`
4. Browser includes the victim's `bank.com` session cookie
5. Bank sees an authenticated request and processes the transfer
6. Money is transferred to attacker without victim's knowledge

## Attack Vectors

### GET Request Exploitation

```html
<!-- Image tag triggers GET request -->
<img src="https://bank.com/transfer?amount=10000&to=attacker">
```

This is why state-changing operations should **never** use GET requests.

### Form Auto-Submission

```html
<form action="https://bank.com/transfer" method="POST">
    <input type="hidden" name="amount" value="10000">
    <input type="hidden" name="to" value="attacker">
</form>
<script>document.forms[0].submit();</script>
```

### XMLHttpRequest/Fetch (Limited)

```javascript
fetch('https://bank.com/transfer', {
    method: 'POST',
    credentials: 'include',  // Send cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 10000, to: 'attacker' })
});
```

**Note**: This is blocked by Same-Origin Policy unless the target site has permissive CORS headers.

### Social Engineering

Attacker sends email or message:
```
"Your account needs verification! Click here:
https://bank.com/delete-account?confirm=yes"
```

Clicking the link while authenticated can perform the action.

## Defense Mechanisms

### 1. CSRF Tokens (Synchronizer Token Pattern)

**The gold standard**. Generate a unique, unpredictable token for each session or request.

**Server-side (Flask)**:
```python
import secrets
from flask import session, request, abort

@app.route('/transfer', methods=['GET'])
def transfer_form():
    # Generate CSRF token
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(32)

    return render_template('transfer.html',
                         csrf_token=session['csrf_token'])

@app.route('/transfer', methods=['POST'])
def transfer():
    # Verify CSRF token
    token = request.form.get('csrf_token')
    if not token or token != session.get('csrf_token'):
        abort(403)  # Forbidden

    # Process transfer
    amount = request.form['amount']
    to_account = request.form['to_account']
    transfer_money(session['user_id'], to_account, amount)

    return "Transfer complete"
```

**Client-side (HTML)**:
```html
<form action="/transfer" method="POST">
    <!-- Include CSRF token as hidden field -->
    <input type="hidden" name="csrf_token" value="{{ csrf_token }}">

    <input name="amount" placeholder="Amount">
    <input name="to_account" placeholder="To Account">
    <button type="submit">Transfer</button>
</form>
```

**Why it works**: The attacker can't read the token from another origin due to Same-Origin Policy, so they can't include it in their forged request.

### 2. SameSite Cookie Attribute

Prevent cookies from being sent with cross-site requests:

```python
# Set SameSite attribute on session cookie
response.set_cookie(
    'session_id',
    value=session_id,
    httponly=True,
    secure=True,
    samesite='Strict'  # or 'Lax'
)
```

**SameSite=Strict**: Cookie never sent on cross-site requests (strongest protection)
**SameSite=Lax**: Cookie sent only on top-level navigations with safe HTTP methods (GET)

**Browser support**: Modern browsers (Chrome 80+, Firefox 69+, Safari 12+)

### 3. Double-Submit Cookie Pattern

Store token in both cookie and request parameter:

```python
import secrets

@app.route('/transfer', methods=['POST'])
def transfer():
    # Token stored in cookie
    cookie_token = request.cookies.get('csrf_token')

    # Token sent in request body
    form_token = request.form.get('csrf_token')

    # Verify they match
    if not cookie_token or cookie_token != form_token:
        abort(403)

    # Process transfer
    # ...
```

**JavaScript (for AJAX)**:
```javascript
// Read token from cookie
const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    .split('=')[1];

// Send in request header
fetch('/transfer', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: 1000, to: '987654' })
});
```

### 4. Custom Request Headers

Require a custom header for state-changing requests:

```python
@app.route('/api/transfer', methods=['POST'])
def api_transfer():
    # Verify custom header is present
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        abort(403)

    # Process transfer
    # ...
```

**Why it works**: Cross-origin requests can't set custom headers without CORS permissions.

**Note**: This only works for AJAX requests, not form submissions.

### 5. Re-authentication for Critical Actions

Require password or MFA for sensitive operations:

```python
@app.route('/delete-account', methods=['POST'])
def delete_account():
    # Require recent authentication
    if time.time() - session.get('last_auth', 0) > 300:  # 5 minutes
        return redirect('/re-authenticate')

    # Or require password confirmation
    password = request.form.get('password')
    if not verify_password(session['user_id'], password):
        abort(403)

    # Proceed with deletion
    # ...
```

### 6. User Interaction Verification

Require CAPTCHA or explicit confirmation for critical actions:

```python
@app.route('/transfer', methods=['POST'])
def transfer():
    # Verify CAPTCHA
    captcha_response = request.form.get('g-recaptcha-response')
    if not verify_captcha(captcha_response):
        abort(403)

    # Process transfer
    # ...
```

## Framework Support

Modern frameworks provide built-in CSRF protection:

**Django**:
```python
# Enabled by default
# Use {% csrf_token %} in templates
```

**Flask-WTF**:
```python
from flask_wtf import FlaskForm
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect(app)

# Forms automatically include CSRF token
```

**Express.js (csurf)**:
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/transfer', csrfProtection, (req, res) => {
    res.render('transfer', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
    // CSRF token automatically verified
    // Process transfer
});
```

**Ruby on Rails**:
```ruby
# Enabled by default
# <%= form_with... %> automatically includes authenticity token
```

## Detection and Prevention

### Code Review Checklist

- [ ] CSRF tokens used for state-changing operations
- [ ] SameSite cookie attribute set appropriately
- [ ] No state changes via GET requests
- [ ] Critical actions require re-authentication
- [ ] Framework CSRF protection enabled
- [ ] Proper CORS configuration
- [ ] Token validation on server side

### Testing for CSRF

**Manual testing**:
1. Identify state-changing endpoint
2. Create HTML page with form targeting that endpoint
3. Open page while authenticated to target app
4. Check if action executes without CSRF token

**Automated scanning**:
- Burp Suite (CSRF PoC generator)
- OWASP ZAP
- CSRFTester

### Burp Suite CSRF PoC Generator

```html
<!-- Auto-generated proof of concept -->
<html>
  <body>
    <form action="https://target.com/transfer" method="POST">
      <input type="hidden" name="amount" value="10000" />
      <input type="hidden" name="to" value="attacker" />
      <input type="submit" value="Submit request" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## Common Pitfalls

**Using GET for state changes**: GET requests are trivially exploitable with `<img>` tags. Use POST, PUT, or DELETE.

**Validating Referer header only**: Referer header can be omitted or spoofed. Use CSRF tokens instead.

**Token in URL parameters**: Tokens in URLs can leak via browser history, logs, or Referer headers. Use POST body or headers.

**Not validating token on every request**: Some frameworks only validate on form submission but not AJAX. Ensure all state-changing endpoints check tokens.

**Accepting empty tokens**: Check that token exists AND matches. Don't accept null/empty tokens as valid.

## Real-World Impact

**Notable incidents**:
- **Netflix (2006)**: CSRF allowed changing user passwords
- **Gmail (2007)**: CSRF enabled mail filters to forward emails
- **YouTube (2008)**: CSRF could perform nearly any authenticated action
- **ING Direct (2006)**: CSRF allowed unauthorized transfers

**Typical damages**:
- Unauthorized fund transfers
- Password changes / account takeover
- Unauthorized purchases
- Email forwarding or filtering
- Social media actions (posts, follows, messages)
- Account deletion

## Security Considerations

**Do**:
- Implement CSRF tokens for all state-changing operations
- Set SameSite cookie attribute
- Use POST/PUT/DELETE for state changes, never GET
- Require re-authentication for critical actions
- Validate tokens on server side
- Use framework-provided CSRF protection
- Implement defense in depth (multiple protections)

**Don't**:
- Use GET requests for state-changing operations
- Rely solely on Referer header validation
- Store CSRF tokens in URLs
- Disable framework CSRF protection without replacement
- Trust client-side validation alone
- Accept empty or null tokens as valid

## Advanced Topics

**Token Rotation**: Generate new token after each use to prevent replay.

**Per-Request Tokens**: More secure than session-based, but complex to implement correctly.

**Origin Header Validation**: Check `Origin` or `Referer` headers as supplementary defense.

## See Also

- [[Cross-Site Scripting]]
- [[Session Management]]
- [[Same-Origin Policy]]
- [[CORS]]
- [[OWASP Top 10]]

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [CWE-352: Cross-Site Request Forgery](https://cwe.mitre.org/data/definitions/352.html)
- [SameSite Cookies Explained](https://web.dev/samesite-cookies-explained/)
- RFC 6265: HTTP State Management Mechanism (Cookies)
- "The Tangled Web: A Guide to Securing Modern Web Applications" (Michal Zalewski)
