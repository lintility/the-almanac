---
title: SQL Injection
chapter: security
type: vulnerability
difficulty: intermediate
prerequisites:
  - "[[Databases]]"
  - "[[SQL Basics]]"
  - "[[Input Validation]]"
related:
  - "[[Cross-Site Scripting]]"
  - "[[Parameterized Queries]]"
  - "[[Prepared Statements]]"
tags:
  - security
  - vulnerabilities
  - owasp-top-10
  - injection
  - database-security
status: published
created: "2026-03-05"
updated: "2026-03-05"
author: Almanac Bot
---

# SQL Injection

## Overview

SQL Injection (SQLi) is a code injection attack where malicious SQL statements are inserted into application input fields, allowing attackers to manipulate database queries. It remains one of the most dangerous web application vulnerabilities, capable of exposing sensitive data, bypassing authentication, and even taking complete control of database servers.

Think of it like a malicious customer at a restaurant who, instead of ordering food, slips instructions to the chef to hand over the restaurant's recipe book and customer list. The kitchen follows the instructions because it can't tell the difference between a legitimate order and a malicious command.

## Core Concept

SQL injection exploits a fundamental mistake: **mixing code and data**. When applications build SQL queries by concatenating user input directly into query strings, they allow attackers to inject their own SQL commands.

**The vulnerability pattern**:
```python
# VULNERABLE - Never do this
username = request.form['username']
password = request.form['password']
query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
```

If an attacker enters `' OR '1'='1` as the username, the query becomes:
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''
```

The `OR '1'='1'` condition is always true, bypassing authentication entirely.

## Attack Vectors

### Authentication Bypass

**Scenario**: Login form with vulnerable query construction

**Malicious input**:
- Username: `admin' --`
- Password: (anything)

**Resulting query**:
```sql
SELECT * FROM users WHERE username = 'admin' -- ' AND password = 'anything'
```

The `--` comments out the rest of the query, allowing login as admin without knowing the password.

### Data Extraction

**Scenario**: Search feature with vulnerable query

**Malicious input**: `' UNION SELECT username, password FROM users --`

**Resulting query**:
```sql
SELECT product_name, price FROM products WHERE category = ''
UNION SELECT username, password FROM users --'
```

This retrieves sensitive user data alongside product information.

### Database Modification

**Malicious input**: `'; DROP TABLE users; --`

**Resulting query**:
```sql
SELECT * FROM products WHERE id = ''; DROP TABLE users; --'
```

This deletes the entire users table (the classic "Bobby Tables" attack).

### Blind SQL Injection

When the application doesn't display database errors or results, attackers use time-based or boolean-based techniques:

**Time-based**:
```sql
' OR IF(1=1, SLEEP(5), 0) --
```

If the response delays 5 seconds, the condition is true. Attackers use this to extract data bit by bit.

## Defense Mechanisms

### 1. Parameterized Queries (Prepared Statements)

**The gold standard**. Separate SQL code from data by using placeholders:

**Python (with psycopg2)**:
```python
# SECURE - Use parameterized queries
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password = %s",
    (username, password)
)
```

**Node.js (with pg)**:
```javascript
// SECURE - Parameterized query
const result = await client.query(
    'SELECT * FROM users WHERE username = $1 AND password = $2',
    [username, password]
);
```

**PHP (with PDO)**:
```php
// SECURE - Prepared statement
$stmt = $pdo->prepare('SELECT * FROM users WHERE username = ? AND password = ?');
$stmt->execute([$username, $password]);
```

**Why it works**: The database treats the parameters as pure data, never as executable code. Even if an attacker enters `' OR '1'='1`, it's interpreted as a literal string to search for, not SQL syntax.

### 2. Object-Relational Mappers (ORMs)

ORMs like SQLAlchemy, Sequelize, or Hibernate use parameterized queries internally:

**Python (SQLAlchemy)**:
```python
# SECURE - ORM handles parameterization
user = session.query(User).filter_by(
    username=username,
    password=password
).first()
```

**TypeScript (Prisma)**:
```typescript
// SECURE - Type-safe ORM
const user = await prisma.user.findFirst({
    where: {
        username: username,
        password: password
    }
});
```

### 3. Input Validation

**Defense in depth**: Validate and sanitize input even when using parameterized queries.

```python
import re

def validate_username(username):
    # Only allow alphanumeric and underscore
    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', username):
        raise ValueError("Invalid username format")
    return username

# Use after validation
username = validate_username(request.form['username'])
```

**Principle**: Reject unexpected input patterns early.

### 4. Least Privilege Database Access

Limit database user permissions:

```sql
-- Don't grant application DB user full privileges
-- GOOD: Read-only for queries, specific permissions for writes
GRANT SELECT ON products TO app_user;
GRANT INSERT, UPDATE ON orders TO app_user;
-- BAD: Full admin access
-- REVOKE ALL PRIVILEGES ON *.* FROM app_user;
```

If SQL injection occurs, the damage is limited to what that database user can do.

### 5. Web Application Firewall (WAF)

Use WAFs to detect and block common SQL injection patterns:
- ModSecurity rules
- Cloud WAF services (AWS WAF, Cloudflare)

**Note**: WAFs are supplementary defenses, not replacements for secure coding.

## Detection and Prevention

### Code Review Checklist

- [ ] All database queries use parameterized queries or prepared statements
- [ ] No string concatenation or interpolation in SQL queries
- [ ] ORM usage follows security best practices
- [ ] Input validation is present at application boundaries
- [ ] Database error messages are not exposed to users
- [ ] Database user has minimal necessary privileges

### Testing for SQL Injection

**Manual testing payloads**:
```
' OR '1'='1
' OR '1'='1' --
' OR '1'='1' /*
admin' --
' UNION SELECT NULL--
'; DROP TABLE users--
```

**Automated scanning**:
- OWASP ZAP
- SQLMap
- Burp Suite

### Static Analysis

Use tools to detect SQL injection vulnerabilities in code:
- Bandit (Python)
- ESLint with security plugins (JavaScript)
- SonarQube
- Semgrep

## Common Pitfalls

**Escaping instead of parameterizing**: String escaping (e.g., `mysql_real_escape_string()`) is error-prone and can be bypassed. Always prefer parameterized queries.

**Second-order SQL injection**: Data stored in the database from user input is later used in unsafe queries. Validate on write AND read.

**Partial parameterization**: Mixing safe parameters with unsafe string concatenation:
```python
# STILL VULNERABLE - table name concatenated
query = f"SELECT * FROM {table_name} WHERE id = %s"
```

**ORM misuse**: Using raw queries or `.execute()` methods that bypass ORM protections defeats the purpose.

## Real-World Impact

**Notable breaches**:
- **Sony Pictures (2011)**: SQL injection exposed 1 million accounts
- **Heartland Payment Systems (2008)**: 130 million credit cards stolen
- **TalkTalk (2015)**: £400,000 fine after SQL injection breach

**Typical damages**:
- Data theft (credentials, personal information, financial data)
- Authentication bypass
- Data manipulation or destruction
- Server takeover
- Regulatory fines (GDPR, PCI-DSS violations)

## Security Considerations

**Do**:
- Use parameterized queries or prepared statements for all database interactions
- Employ ORMs that handle parameterization correctly
- Validate and sanitize all user input
- Apply least privilege principle to database accounts
- Log and monitor for suspicious query patterns
- Keep database software patched and updated
- Use stored procedures with appropriate permissions

**Don't**:
- Concatenate user input into SQL queries
- Display database error messages to users (they leak schema information)
- Trust client-side validation alone
- Use dynamic SQL when parameterized queries are available
- Grant excessive database privileges to application accounts

## Advanced Topics

**Stored Procedures**: Can reduce SQL injection risk if properly parameterized, but vulnerable if they build dynamic SQL internally.

**NoSQL Injection**: Similar attacks exist for NoSQL databases (MongoDB, CouchDB). Validation and parameterization still apply.

**Blind SQL Injection Mitigation**: Time-based attacks can be mitigated by implementing query timeouts and monitoring for unusual response times.

## See Also

- [[Parameterized Queries]]
- [[Input Validation]]
- [[Cross-Site Scripting]]
- [[Database Security]]
- [[OWASP Top 10]]

## References

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [CWE-89: SQL Injection](https://cwe.mitre.org/data/definitions/89.html)
- [NIST Special Publication 800-53: Security Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
- Bobby Tables: A Guide to Preventing SQL Injection - [https://bobby-tables.com/](https://bobby-tables.com/)
- "SQL Injection Attacks and Defense" (Justin Clarke)
