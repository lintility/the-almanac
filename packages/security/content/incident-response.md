---
title: Incident Response
chapter: security
type: process
difficulty: intermediate
prerequisites:
  - "[[Incident Detection]]"
  - "[[Forensics]]"
related:
  - "[[Incident Handling]]"
  - "[[Containment]]"
  - "[[Root Cause Analysis]]"
  - "[[Disaster Recovery]]"
tags:
  - security
  - incident-response
  - operations
  - crisis-management
status: published
created: "2026-02-16"
updated: "2026-02-16"
author: Almanac Bot
---

# Incident Response

## Overview

Incident response (IR) is the structured approach to handling security breaches, cyber attacks, or other security events. It's about minimizing damage, reducing recovery time, and learning from what happened to prevent future incidents.

Think of it like a fire drill—but for cyber attacks. You don't want to figure out who's in charge and what to do while the building is burning. You prepare beforehand, practice regularly, and execute decisively when something goes wrong.

**The golden rule:** Every minute counts. The faster you detect, contain, and eradicate a threat, the less damage an attacker can do.

## Core Concept

Incident response answers four critical questions:

1. **What happened?** (Detection & Analysis)
2. **How bad is it?** (Scope Determination)
3. **How do we stop it?** (Containment & Eradication)
4. **How do we prevent it from happening again?** (Post-Incident Review)

**Why IR matters:**

- **Ransomware:** Average recovery cost is $1.85M (excluding ransom payment)
- **Data breaches:** Average cost is $4.45M, up to $9.48M for healthcare
- **Regulatory fines:** GDPR violations can cost up to €20M or 4% of annual revenue
- **Downtime:** Every minute of outage costs money and damages reputation

**The difference between good and bad IR:**
- **Good IR:** Incident detected in minutes, contained in hours, minimal data loss
- **Bad IR:** Incident undetected for months, widespread damage, regulatory fines, reputational collapse

## The IR Lifecycle (NIST Framework)

The NIST SP 800-61 framework defines four phases:

### 1. Preparation
**Before the incident happens.**

**Activities:**
- Create an incident response plan (IRP)
- Assemble and train the IR team
- Deploy monitoring and detection tools (SIEM, EDR, IDS)
- Establish communication channels (Slack war room, PagerDuty)
- Document network topology and critical assets
- Set up forensic tools and offline backups
- Run tabletop exercises (practice scenarios)

**Key artifacts:**
- Incident response plan document
- Contact list (on-call rotation, escalation paths)
- Playbooks for common incidents (ransomware, data breach, DDoS)
- Pre-approved containment actions (isolate host, block IP, disable account)

**Why preparation matters:**
> "In the middle of a ransomware attack is the worst time to figure out where your backups are."

### 2. Detection & Analysis
**Identify and understand the incident.**

**Activities:**
- Monitor alerts from SIEM, EDR, IDS, firewalls
- Triage alerts (false positive vs. real threat)
- Determine scope (which systems? how many users? what data?)
- Classify severity (critical, high, medium, low)
- Collect initial evidence (logs, memory dumps, network captures)
- Establish timeline (when did it start? what was the entry point?)

**Common detection sources:**
- SIEM alerts (Splunk, ELK, Sentinel)
- EDR alerts (CrowdStrike, Carbon Black, SentinelOne)
- User reports ("My account is locked," "I got a weird email")
- Threat intelligence feeds (IOCs, CVE announcements)
- Anomaly detection (unusual traffic, off-hours logins)

**Incident severity classification:**

| Severity | Example | Response Time | Escalation |
|----------|---------|---------------|------------|
| **Critical** | Ransomware deployment, data exfiltration | Immediate (< 15 min) | CEO, legal, PR |
| **High** | Privilege escalation, malware infection | < 1 hour | CISO, IT leadership |
| **Medium** | Phishing campaign, vulnerability scan | < 4 hours | Security team |
| **Low** | Policy violation, suspicious activity | < 24 hours | SOC analyst |

### 3. Containment, Eradication, Recovery
**Stop the bleeding, remove the threat, restore operations.**

#### Containment (Stop the spread)

**Short-term containment:**
- Isolate infected systems from network
- Block attacker's IP addresses at firewall
- Disable compromised user accounts
- Take down phishing sites
- Shut down affected services (if necessary)

**Long-term containment:**
- Segment network to limit lateral movement
- Apply emergency patches
- Harden configurations
- Monitor for re-infection attempts

**Containment decisions:**
- **Aggressive:** Pull the network cable (stops spread, but loses evidence)
- **Surgical:** Isolate specific hosts (preserves evidence, slower)
- **Monitored:** Let the attack continue under observation (honeypot, gather intel)

> "Containment is a risk trade-off: stop the attack fast vs. preserve forensic evidence."

#### Eradication (Remove the threat)

**Activities:**
- Remove malware from infected systems
- Delete backdoor accounts created by attacker
- Patch exploited vulnerabilities
- Reset compromised credentials
- Rebuild compromised systems from clean images

**Common mistakes:**
- Cleaning malware but missing the backdoor (attacker returns)
- Not resetting credentials (attacker still has access)
- Forgetting to patch the entry point (re-infection)

#### Recovery (Restore to normal operations)

**Activities:**
- Restore data from backups
- Rebuild compromised systems
- Validate system integrity (clean? no malware?)
- Gradually bring services back online
- Monitor for signs of re-infection
- Verify business functionality

**Recovery validation checklist:**
- All malware removed?
- All backdoors closed?
- All credentials reset?
- Vulnerability patched?
- Backups tested and restored?
- Systems monitored for 72 hours post-recovery?

### 4. Post-Incident Activity
**Learn from what happened.**

**Activities:**
- Conduct post-mortem meeting (blameless!)
- Document timeline of events
- Identify root cause
- Update incident response plan
- Update playbooks based on lessons learned
- Share findings with stakeholders
- Improve detections (add SIEM rules for this attack)
- Conduct follow-up training

**Post-mortem template:**
```
Incident: [Ransomware attack on production servers]
Date: [2024-01-15 03:22 UTC]
Duration: [4 hours 37 minutes]

Timeline:
03:22 - Initial phishing email delivered
05:14 - User clicked malicious link
06:45 - Malware executed, lateral movement started
07:12 - Ransomware deployed on 12 servers
07:19 - SOC analyst detected anomalous activity
07:30 - Incident response team assembled
08:15 - Network isolated, containment complete
11:59 - Systems restored from backups

Root Cause:
- User clicked phishing link (MFA not enabled)
- Lateral movement via admin credentials in plaintext config file
- No network segmentation (ransomware spread to all servers)

What Went Well:
- Backups were clean and recoverable
- Team responded quickly once alerted
- Communication was clear

What Could Be Improved:
- Enable MFA for all users (would have prevented initial access)
- Implement network segmentation (would have limited spread)
- Remove plaintext credentials from config files
- Faster detection (4-hour window too long)

Action Items:
1. [OWNER] Enable MFA organization-wide by [DATE]
2. [OWNER] Implement VLAN segmentation by [DATE]
3. [OWNER] Scan for plaintext credentials in repos by [DATE]
4. [OWNER] Add SIEM rule for unusual process execution
```

**Why post-mortems matter:**
The average organization experiences the same type of incident 2.3 times before fixing the root cause. Post-mortems break that cycle.

## IR Team Roles

### Incident Commander
**The decision-maker. Single point of authority during an incident.**

**Responsibilities:**
- Declare incident severity
- Coordinate team activities
- Make containment decisions (shut down servers? isolate network?)
- Communicate with executive leadership
- Authorize expenditures (cloud resources, outside consultants)
- Decide when incident is resolved

**Skills needed:**
- Strong decision-making under pressure
- Technical knowledge (doesn't need to be deepest, but needs context)
- Communication skills
- Authority to make difficult calls (trade-offs between security and business impact)

### Security Analyst / Investigator
**The detective. Figures out what happened.**

**Responsibilities:**
- Analyze logs, network traffic, memory dumps
- Identify indicators of compromise (IOCs)
- Determine attack timeline and scope
- Collect and preserve evidence
- Perform digital forensics
- Track attacker's actions (TTPs)

**Tools:**
- SIEM (Splunk, ELK, Sentinel)
- Forensic tools (Volatility, Autopsy, FTK)
- Network analysis (Wireshark, Zeek, NetworkMiner)
- Malware analysis (sandbox, reverse engineering tools)

### Systems Engineer
**The fixer. Contains the threat and restores systems.**

**Responsibilities:**
- Isolate compromised systems
- Apply patches and fixes
- Rebuild infected hosts
- Restore from backups
- Validate system integrity
- Harden configurations

**Skills needed:**
- System administration (Linux, Windows, cloud)
- Networking knowledge
- Backup/restore procedures
- Scripting (automation of containment actions)

### Communications Lead
**The messenger. Manages internal and external communications.**

**Responsibilities:**
- Update stakeholders (executives, affected users, customers)
- Coordinate with PR team (external communications)
- Notify regulators (GDPR, PCI-DSS, HIPAA requirements)
- Manage customer support inquiries
- Draft incident disclosure statements

**Why this role matters:**
Bad communication during an incident can be worse than the incident itself (Equifax breach: poor handling cost CEO his job).

### Legal Counsel
**The compliance guardian.**

**Responsibilities:**
- Advise on regulatory obligations (breach notification laws)
- Coordinate with law enforcement (if criminal activity)
- Manage litigation risk
- Review public statements
- Determine data breach notification requirements

**When to involve legal:**
- Data exfiltration detected
- Ransomware demand received
- Suspected insider threat
- Any incident involving customer PII

## Common Incident Types

### Ransomware
**Attacker encrypts your files, demands payment for decryption key.**

**Indicators:**
- Files renamed with strange extensions (`.locked`, `.encrypted`)
- Ransom note displayed on desktops
- Mass file modifications in short time
- Backup systems targeted

**Response priorities:**
1. Isolate infected systems (prevent spread)
2. Identify ransomware variant (some have free decryptors)
3. Check backups (when was last clean backup?)
4. DO NOT pay ransom (no guarantee, funds criminals)
5. Restore from backups if possible
6. Report to law enforcement (FBI IC3)

**Prevention:**
- Offline backups (air-gapped, immutable)
- Network segmentation
- Endpoint protection (EDR)
- User training (phishing is #1 entry point)

### Data Breach / Exfiltration
**Attacker steals sensitive data (customer PII, trade secrets, credentials).**

**Indicators:**
- Large data transfers to external IPs
- Database dumps created
- Unusual access to sensitive files
- Cloud storage misconfigurations

**Response priorities:**
1. Determine scope (what data? how much? how many records?)
2. Stop ongoing exfiltration
3. Preserve evidence (logs, network captures)
4. Assess legal obligations (GDPR, state laws)
5. Notify affected individuals (if required)
6. Offer credit monitoring (if PII exposed)

**Breach notification timelines:**
- **GDPR:** 72 hours to notify supervisory authority
- **CCPA:** "Without unreasonable delay"
- **HIPAA:** 60 days for breaches >500 individuals
- **PCI-DSS:** Immediate notification to payment brands

### Phishing Campaign
**Attacker sends fake emails to steal credentials or deliver malware.**

**Indicators:**
- Multiple users report suspicious emails
- Spike in failed login attempts
- Users visiting lookalike domains
- Credential harvesting site detected

**Response priorities:**
1. Identify affected users (who clicked? who entered credentials?)
2. Block sender addresses and malicious URLs
3. Reset credentials for compromised accounts
4. Check for unauthorized access using stolen creds
5. User awareness training (teach people to spot phishing)

**Containment:**
```bash
# Block malicious domain in firewall
iptables -A OUTPUT -d phishing-site.com -j DROP

# Quarantine all emails from sender
# (email gateway admin console)

# Force password reset for affected users
for user in $(cat affected_users.txt); do
    reset-password $user --force-change
done
```

### DDoS Attack
**Attacker floods your network/servers with traffic, causing outage.**

**Indicators:**
- Website unreachable
- Massive traffic spike (10-100x normal)
- Server resource exhaustion (CPU, bandwidth)
- Firewall state table full

**Response priorities:**
1. Engage DDoS mitigation service (Cloudflare, Akamai, AWS Shield)
2. Identify attack type (volumetric, protocol, application-layer)
3. Block source IPs (if small-scale attack)
4. Scale infrastructure (if possible)
5. Communicate with customers (status page updates)

**Prevention:**
- Use CDN/DDoS protection service
- Overprovision bandwidth
- Rate limiting
- Anycast network

### Insider Threat
**Malicious or negligent employee causes security incident.**

**Indicators:**
- Access to data outside job role
- After-hours access to sensitive systems
- Large data downloads before resignation
- Disgruntled employee behavior

**Response priorities:**
1. Coordinate with HR (legal considerations)
2. Preserve evidence (don't tip off suspect)
3. Revoke access immediately when safe
4. Review access logs (what did they access?)
5. Assess data loss
6. Consider law enforcement (if criminal)

**Challenges:**
- Insider has legitimate access (hard to detect abuse)
- Legal/HR coordination required
- Risk of wrongful accusation

## Compliance & Regulations

### GDPR (General Data Protection Regulation)
**Applies to:** EU residents' data

**Requirements:**
- Notify supervisory authority within 72 hours of breach discovery
- Notify affected individuals "without undue delay" if high risk
- Document breach (even if not reportable)
- Fines: Up to €20M or 4% of annual global revenue

**What constitutes a "breach":**
- Unauthorized access to personal data
- Accidental deletion or loss
- Data exfiltration
- Ransomware (even if data not accessed)

### HIPAA (Health Insurance Portability and Accountability Act)
**Applies to:** Healthcare providers, insurers (US)

**Requirements:**
- Notify HHS within 60 days for breaches affecting >500 individuals
- Notify affected individuals within 60 days
- Notify media if breach affects >500 individuals in a state
- Fines: Up to $50,000 per violation

### PCI-DSS (Payment Card Industry Data Security Standard)
**Applies to:** Organizations that handle credit card data

**Requirements:**
- Immediate notification to payment brands (Visa, Mastercard)
- Engage PCI Forensic Investigator (PFI) for breach investigation
- Fines: $5,000-$100,000 per month until compliant
- May lose ability to process cards

**Incident response requirements:**
- Documented IR plan
- Quarterly incident response training
- Annual testing of IR procedures

### SOC 2 Type II
**Applies to:** Service providers handling customer data

**Requirements:**
- Documented incident response procedures
- Evidence of incident handling
- Regular IR testing
- Communication procedures with customers

## Implementation Examples

### Incident Response Checklist

```markdown
## DETECTION PHASE
- [ ] Alert received from: _______________
- [ ] Severity classified as: _______________
- [ ] Incident Commander notified: _______________
- [ ] IR team assembled: _______________

## ANALYSIS PHASE
- [ ] Initial triage completed
- [ ] Scope determined: _____ systems affected
- [ ] Timeline established: First compromise at _____
- [ ] IOCs identified: [list]
- [ ] Evidence collected and preserved

## CONTAINMENT PHASE
- [ ] Infected systems isolated
- [ ] Attacker IPs blocked
- [ ] Compromised accounts disabled
- [ ] Lateral movement prevented
- [ ] Backups verified clean

## ERADICATION PHASE
- [ ] Malware removed
- [ ] Backdoors closed
- [ ] Vulnerabilities patched
- [ ] Credentials rotated
- [ ] Systems hardened

## RECOVERY PHASE
- [ ] Systems restored from backup
- [ ] Integrity validated
- [ ] Services brought online
- [ ] Monitoring enabled
- [ ] 72-hour observation period complete

## POST-INCIDENT PHASE
- [ ] Post-mortem scheduled
- [ ] Timeline documented
- [ ] Root cause identified
- [ ] Lessons learned captured
- [ ] IR plan updated
- [ ] Regulatory notifications sent (if required)
```

### Incident Severity Matrix

```
CRITICAL:
- Ransomware deployment
- Active data exfiltration
- Root/Domain Admin compromise
- Public disclosure of breach
- Outage of critical business function
→ Response: Immediate, 24/7 team, executive involvement

HIGH:
- Malware infection (not spreading)
- Privilege escalation
- Unauthorized access to sensitive data
- DDoS attack (partial impact)
→ Response: Within 1 hour, full IR team

MEDIUM:
- Phishing campaign (no clicks)
- Failed intrusion attempt
- Policy violation (non-critical)
- Vulnerability scan detected
→ Response: Within 4 hours, SOC analyst + engineer

LOW:
- Suspected malicious email
- Anomalous behavior (low confidence)
- Minor policy violation
→ Response: Within 24 hours, SOC analyst review
```

### Communication Templates

**Internal: Executive Update**
```
To: CEO, CISO, CTO
Subject: URGENT: Security Incident Update #3

Incident: Ransomware attack on production environment
Status: CONTAINED
Impact: 12 servers affected, customer-facing services restored
Risk: LOW (no customer data compromised)

Timeline:
07:19 - Incident detected
07:30 - IR team assembled
08:15 - Containment complete
11:59 - Services restored

Next Steps:
- Post-mortem scheduled for tomorrow 10am
- Forensic investigation ongoing
- No regulatory notification required (no data loss)

Incident Commander: [Name]
```

**External: Customer Notification (Data Breach)**
```
Subject: Important Security Notice

Dear [Customer],

We are writing to inform you of a security incident that may have affected your personal information.

What Happened:
On [DATE], we discovered unauthorized access to our database containing customer records.

What Information Was Involved:
- Name
- Email address
- Encrypted password (NOT plaintext)
- NO credit card data (we don't store payment information)

What We're Doing:
- We've secured our systems and blocked the unauthorized access
- We've engaged a leading cybersecurity firm to investigate
- We've notified law enforcement and relevant regulators
- We're offering 12 months of free credit monitoring

What You Should Do:
- Reset your password immediately
- Enable two-factor authentication
- Monitor your accounts for suspicious activity
- Watch for phishing emails claiming to be from us

We take this matter very seriously and apologize for any concern this may cause.

For questions: security-incident@example.com
```

## Tools & Technologies

### SIEM (Security Information and Event Management)
**Aggregates and analyzes logs from all systems.**

**Popular SIEMs:**
- Splunk (expensive, powerful)
- ELK Stack (open-source, DIY)
- Microsoft Sentinel (Azure-native)
- Chronicle (Google Cloud)

**What it does:**
- Collects logs from firewalls, servers, endpoints, apps
- Correlates events (login from Beijing + file download = alert)
- Provides search and visualization
- Triggers alerts on suspicious activity

### EDR (Endpoint Detection and Response)
**Monitors and protects individual devices (laptops, servers).**

**Popular EDR:**
- CrowdStrike Falcon
- Carbon Black
- SentinelOne
- Microsoft Defender for Endpoint

**Capabilities:**
- Real-time malware detection
- Behavioral analysis
- Remote isolation (quarantine infected host)
- Forensic data collection

### Forensic Tools
**Investigate what happened after an incident.**

**Memory analysis:**
- Volatility (analyze RAM dumps)

**Disk forensics:**
- Autopsy (GUI for The Sleuth Kit)
- FTK Imager (disk imaging)

**Network forensics:**
- Wireshark (packet capture analysis)
- Zeek (network security monitor)
- NetworkMiner (PCAP analysis)

### Ticketing / Case Management
**Track incident progress and documentation.**

**Tools:**
- TheHive (open-source IR platform)
- JIRA (general ticketing)
- ServiceNow (enterprise ITSM)
- PagerDuty (on-call management)

## Key Principles

### Speed Matters (But Don't Sacrifice Accuracy)

```
Dwell Time = Time from initial compromise to detection

Industry average: 204 days (2023)
Target: < 24 hours
```

The faster you detect and respond, the less damage an attacker can do.

**But:** Rushing containment can destroy forensic evidence. Balance speed with thoroughness.

### Document Everything

**Why:**
- Legal proceedings (evidence chain of custody)
- Post-mortem analysis
- Regulatory compliance
- Insurance claims

**What to document:**
- All actions taken (who, what, when)
- Commands run
- Systems accessed
- Evidence collected
- Communications sent

**Use:**
- Screen recordings
- Command history logs
- Timestamped notes
- Evidence bags/labels

### Don't Destroy Evidence

**Bad:**
```bash
# Rebooting destroys RAM contents (malware artifacts)
sudo reboot

# Deleting malware loses evidence
rm malware.exe
```

**Good:**
```bash
# Capture memory first
sudo avml memory.raw

# Isolate system (don't delete anything)
sudo iptables -A INPUT -j DROP
sudo iptables -A OUTPUT -j DROP

# Preserve malware sample
cp malware.exe /evidence/malware_$(date +%s).exe
```

### Practice Regularly

**Tabletop exercises:** Walk through scenarios on paper (no systems involved)
- "Ransomware just hit. What do we do first?"
- Identify gaps in plan
- Low-cost, high-value

**Simulations:** Actual attack simulation (with red team)
- Tests technical + organizational response
- Identifies weaknesses in tools, processes, people

**Recommended frequency:**
- Tabletop: Quarterly
- Full simulation: Annually

### Have a War Room

**Physical or virtual space for IR team during incidents.**

**What it needs:**
- Dedicated communication channel (Slack, Teams, Discord)
- Video conferencing (Zoom, Meet)
- Shared documentation (Google Docs, Confluence)
- Status dashboard (incident timeline, affected systems)
- On-call contact list

**Why:**
Centralizes communication, reduces confusion, improves coordination.

## Common Pitfalls

### No Incident Response Plan

**Result:** Chaos during incident (who's in charge? what do we do?)

**Fix:** Write the plan NOW, before you need it.

### Not Testing the Plan

**Result:** Plan fails when you try to use it (backups don't work, contact list outdated)

**Fix:** Annual tabletop exercise + test backups quarterly.

### Poor Communication

**Result:** Mixed messages, customer panic, regulatory fines

**Examples:**
- Different teams giving conflicting information
- Hiding breach from customers (worse when discovered)
- Not notifying regulators within required timeframe

**Fix:** Single Communications Lead, pre-approved templates, clear escalation paths.

### Destroying Evidence

**Result:** Can't prosecute attacker, can't do forensic analysis, can't learn

**Common mistakes:**
- Rebooting infected systems (loses RAM)
- Deleting malware immediately
- Not preserving logs

**Fix:** Forensic training, evidence preservation procedures.

### Not Involving Legal Early

**Result:** Violations of breach notification laws, lost attorney-client privilege

**When to involve legal:**
- Any data breach
- Ransomware demand
- Suspected insider threat
- Law enforcement contact

**Fix:** Add legal to IR team contact list, involve early.

## See Also

- [[Incident Detection]]
- [[Forensics]]
- [[Containment]]
- [[Eradication]]
- [[Root Cause Analysis]]
- [[Disaster Recovery]]
- [[Business Continuity Planning]]
- [[SIEM]]
- [[Threat Intelligence]]

## References

- [NIST SP 800-61r2: Computer Security Incident Handling Guide](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)
- [SANS Incident Handler's Handbook](https://www.sans.org/white-papers/33901/)
- [CISA Incident Response Guide](https://www.cisa.gov/sites/default/files/publications/Federal_Government_Cybersecurity_Incident_and_Vulnerability_Response_Playbooks_508C.pdf)
- [GDPR Article 33: Breach Notification](https://gdpr-info.eu/art-33-gdpr/)
- [PCI-DSS: Incident Response Requirements](https://www.pcisecuritystandards.org/documents/Responding_to_a_Cardholder_Data_Breach.pdf)
- [Google SRE Book: Incident Management](https://sre.google/sre-book/managing-incidents/)
- [Awesome Incident Response (GitHub)](https://github.com/meirwah/awesome-incident-response)
