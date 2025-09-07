# Security Policy - SIWarga v1.0.0

SIWarga takes security seriously. This document outlines our security practices, how to report vulnerabilities, and guidelines for maintaining a secure deployment.

## 📋 Table of Contents

- [Security Overview](#security-overview)
- [Supported Versions](#supported-versions)
- [Reporting Vulnerabilities](#reporting-vulnerabilities)
- [Security Features](#security-features)
- [Security Best Practices](#security-best-practices)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Security Configuration](#security-configuration)
- [Incident Response](#incident-response)

## 🛡️ Security Overview

SIWarga implements multiple layers of security to protect sensitive citizen data and maintain system integrity. Our security approach follows industry best practices and compliance standards.

### Security Principles
- **Defense in Depth**: Multiple security layers
- **Least Privilege**: Minimal access rights
- **Zero Trust**: Verify everything, trust nothing
- **Data Protection**: Encryption and secure storage
- **Audit Trail**: Comprehensive logging
- **Regular Updates**: Security patches and updates

### Compliance Standards
- **Data Protection**: Indonesia's data protection regulations
- **Security Standards**: OWASP Top 10 compliance
- **Access Control**: Role-based access control (RBAC)
- **Audit Requirements**: Government audit standards

## 📋 Supported Versions

We actively maintain security for the following versions:

| Version | Supported          | Security Updates | End of Life |
| ------- | ------------------ | ---------------- | ----------- |
| 1.0.x   | ✅ Yes             | ✅ Active        | TBD         |
| < 1.0   | ❌ No              | ❌ None          | 2025-01-01  |

### Update Policy
- **Critical Security Issues**: Patches within 24-48 hours
- **High Priority**: Patches within 1 week
- **Medium Priority**: Patches within 1 month
- **Low Priority**: Included in next regular release

## 🚨 Reporting Vulnerabilities

### Reporting Process

1. **Contact**: Email security issues to `sutiyonodoang@gmail.com`
2. **Subject**: Include "[SECURITY]" in email subject
3. **Information**: Provide detailed vulnerability information
4. **Response**: We will acknowledge within 24 hours
5. **Resolution**: Updates provided within 48-72 hours

### What to Include
```markdown
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Affected versions
- Suggested remediation (if any)
- Your contact information
```

### Responsible Disclosure
- **Coordination**: Work with us to verify and fix issues
- **Timeline**: Allow reasonable time for fixes before disclosure
- **Credit**: We will acknowledge your contribution
- **Bounty**: Recognition and appreciation (no monetary rewards currently)

### What NOT to Do
- Do not access or modify data without permission
- Do not perform DoS attacks or resource exhaustion
- Do not share vulnerabilities publicly before fixes
- Do not exploit vulnerabilities for personal gain

## 🔒 Security Features

### Authentication & Authorization
```php
✅ Session-based authentication with CSRF protection
✅ Role-based access control (Admin, Operator, Viewer)
✅ Permission-based resource access
✅ Secure password hashing (bcrypt)
✅ Session timeout and management
✅ Failed login attempt tracking
```

### Data Protection
```php
✅ SQLite database encryption support
✅ Sensitive data field encryption
✅ Secure backup with encryption options
✅ Data validation and sanitization
✅ SQL injection prevention (Eloquent ORM)
✅ XSS protection (built-in escaping)
```

### Network Security
```php
✅ HTTPS enforcement in production
✅ Secure headers (HSTS, CSP, X-Frame-Options)
✅ Rate limiting and throttling
✅ CSRF token validation
✅ Origin validation
✅ IP-based access controls
```

### Application Security
```php
✅ Input validation and sanitization
✅ Output encoding and escaping
✅ Secure file upload handling
✅ Path traversal prevention
✅ Command injection prevention
✅ Dependency security scanning
```

### Database Security
```php
✅ Database connection encryption
✅ Prepared statements (SQL injection prevention)
✅ Database user privilege restrictions
✅ Query monitoring and logging
✅ Rate limiting for database operations
✅ Backup encryption and secure storage
```

### Monitoring & Logging
```php
✅ Security event logging
✅ Failed authentication tracking
✅ Suspicious activity detection
✅ Database query monitoring
✅ Performance monitoring
✅ Error tracking and reporting
```

## 🔧 Security Best Practices

### For Administrators

#### Server Configuration
```bash
# 1. Keep system updated
sudo apt update && sudo apt upgrade -y

# 2. Configure firewall
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# 3. Secure SSH access
sudo nano /etc/ssh/sshd_config
# Disable root login: PermitRootLogin no
# Use key-based authentication
# Change default port if needed

# 4. Set up fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

#### Database Security
```bash
# 1. Secure database file permissions
chmod 600 database/siwarga_secure.sqlite
chown www-data:www-data database/siwarga_secure.sqlite

# 2. Enable database encryption
# In .env file:
DB_ENCRYPTION_ENABLED=true

# 3. Regular backups with encryption
php artisan db:backup --encrypt

# 4. Monitor database access
tail -f storage/logs/database.log
```

#### Web Server Security
```apache
# Apache security configuration
<Directory /var/www/siwarga-app>
    # Disable server signature
    ServerSignature Off
    ServerTokens Prod
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Content-Security-Policy "default-src 'self'"
    
    # HTTPS enforcement
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # Hide sensitive files
    <Files ".env">
        Require all denied
    </Files>
    
    <Files "*.sqlite">
        Require all denied
    </Files>
</Directory>
```

#### Application Security
```env
# Production security settings
APP_ENV=production
APP_DEBUG=false

# Strong session configuration
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict
SESSION_LIFETIME=120

# Rate limiting
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_MAX_QUERIES_PER_MINUTE=50
SECURITY_SUSPICIOUS_THRESHOLD=25

# Database security
DB_ENCRYPTION_ENABLED=true
DB_BACKUP_ENCRYPTION=true

# Logging
LOG_LEVEL=warning
LOG_SECURITY_EVENTS=true
```

### For Developers

#### Secure Coding Practices
```php
// 1. Always validate input
$request->validate([
    'email' => 'required|email|max:255',
    'password' => 'required|min:8|confirmed',
    'nik' => 'required|digits:16|unique:anggota_keluargas,nik'
]);

// 2. Use Eloquent ORM (prevents SQL injection)
$user = User::where('email', $request->email)->first();

// 3. Escape output in Blade templates
{{ $user->name }} // Automatically escaped
{!! $trustedHtml !!} // Only for trusted content

// 4. Protect against mass assignment
protected $fillable = ['name', 'email'];
protected $guarded = ['id', 'role'];

// 5. Use proper authorization
$this->authorize('update', $kartuKeluarga);

// 6. Secure file uploads
$request->validate([
    'file' => 'required|file|mimes:jpg,png,pdf|max:2048'
]);
```

#### Security Middleware
```php
// Apply security middleware to routes
Route::middleware(['auth', 'permission:kartu-keluarga.view'])
    ->get('/kartu-keluarga', [KartuKeluargaController::class, 'index']);

// Rate limiting for API routes
Route::middleware(['throttle:api'])
    ->prefix('api/v1')
    ->group(function () {
        // API routes
    });

// Database security middleware
Route::middleware(['database.security', 'database.rate.limit'])
    ->group(function () {
        // Database operations
    });
```

### For Users

#### Account Security
```markdown
✅ Use strong, unique passwords (minimum 8 characters)
✅ Enable account lockout after failed attempts
✅ Log out completely when finished
✅ Report suspicious activity immediately
✅ Keep contact information updated
✅ Review activity logs regularly
```

#### Safe Usage Practices
```markdown
✅ Access system from trusted devices only
✅ Use secure, private network connections
✅ Verify URLs before entering credentials
✅ Do not share login credentials
✅ Report unauthorized access immediately
✅ Follow data handling policies
```

## ⚠️ Common Vulnerabilities

### Prevented Vulnerabilities

#### SQL Injection (PREVENTED)
```php
// ❌ Vulnerable code (NOT used in SIWarga)
$query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";

// ✅ Safe code (used in SIWarga)
$user = User::where('email', $request->email)->first();
```

#### Cross-Site Scripting (XSS) (PREVENTED)
```blade
{{-- ❌ Vulnerable code (NOT used in SIWarga) --}}
{!! $userInput !!}

{{-- ✅ Safe code (used in SIWarga) --}}
{{ $userInput }}
```

#### Cross-Site Request Forgery (CSRF) (PREVENTED)
```html
<!-- ✅ CSRF protection (required in SIWarga) -->
<form method="POST" action="/kartu-keluarga">
    @csrf
    <!-- Form fields -->
</form>
```

#### Insecure Direct Object Reference (PREVENTED)
```php
// ❌ Vulnerable code (NOT used in SIWarga)
$kk = KartuKeluarga::find($request->id);

// ✅ Safe code (used in SIWarga)
$kk = KartuKeluarga::where('id', $request->id)
    ->where('user_id', auth()->id())
    ->firstOrFail();
```

### Security Testing
```bash
# Regular security scans
composer audit                    # Check dependencies
npm audit                        # Check Node.js dependencies
php artisan security:scan         # Application security scan

# Manual testing checklist
- Authentication bypass attempts
- Authorization escalation tests
- Input validation testing
- SQL injection attempts
- XSS payload testing
- CSRF attack simulation
- File upload security testing
```

## ⚙️ Security Configuration

### Environment Security
```env
# .env.example - Security section
# =================================

# Application Security
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-strong-app-key

# Session Security
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict

# Database Security
DB_CONNECTION=sqlite
DB_DATABASE=database/siwarga_secure.sqlite
DB_ENCRYPTION_ENABLED=true
DB_BACKUP_ENCRYPTION=true

# Rate Limiting
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_MAX_QUERIES_PER_MINUTE=50
SECURITY_MAX_ADMIN_QUERIES_PER_MINUTE=200
SECURITY_SUSPICIOUS_THRESHOLD=25

# Logging
LOG_LEVEL=warning
LOG_SECURITY_EVENTS=true
LOG_FAILED_LOGINS=true

# Mail Security (for notifications)
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Security Headers Configuration
```php
// config/security.php
return [
    'headers' => [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'SAMEORIGIN',
        'X-XSS-Protection' => '1; mode=block',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains'
    ],
    
    'rate_limiting' => [
        'api' => '100,1',
        'web' => '1000,1',
        'auth' => '5,1'
    ]
];
```

## 🚨 Incident Response

### Security Incident Classification
```
🔴 CRITICAL: Data breach, system compromise, authentication bypass
🟠 HIGH: Privilege escalation, data exposure, service disruption
🟡 MEDIUM: Unauthorized access attempt, suspicious activity
🟢 LOW: Configuration issue, minor vulnerability
```

### Incident Response Process

#### 1. Detection & Analysis
```markdown
- Monitor security logs and alerts
- Analyze suspicious activities
- Determine incident severity
- Document initial findings
```

#### 2. Containment
```bash
# Immediate containment steps
php artisan down --secret="emergency-maintenance"  # Maintenance mode
php artisan route:clear                            # Clear route cache
php artisan config:clear                           # Clear config cache

# Block suspicious IP addresses
echo "deny from suspicious.ip.address" >> .htaccess

# Revoke user sessions if needed
php artisan session:flush
```

#### 3. Investigation
```markdown
- Collect and preserve evidence
- Analyze attack vectors
- Identify affected systems/data
- Determine root cause
- Document timeline of events
```

#### 4. Recovery
```bash
# System recovery steps
php artisan optimize:clear                         # Clear all caches
php artisan migrate:status                         # Check database integrity
php artisan db:backup --encrypt                    # Create backup before changes
php artisan security:patch                         # Apply security patches
php artisan up                                     # Bring system back online
```

#### 5. Lessons Learned
```markdown
- Document incident details
- Update security procedures
- Implement preventive measures
- Train team on new procedures
- Update incident response plan
```

### Emergency Contacts
```
Security Team: sutiyonodoang@gmail.com
Primary Response: Available 24/7
Secondary Response: Email support
Escalation: GitHub Issues for non-critical items
```

### Recovery Procedures
```bash
# Database recovery from backup
php artisan db:restore backup-filename.enc

# Application recovery
git checkout main                                  # Return to stable version
composer install --no-dev                         # Reinstall dependencies
npm ci --only=production                           # Reinstall Node modules
php artisan migrate --force                        # Update database
php artisan optimize                               # Optimize for production

# Security validation
php artisan security:scan                          # Run security scan
php artisan permission:check                       # Verify permissions
php artisan config:validate                        # Validate configuration
```

---

## 📞 Security Support

For security-related questions and support:

**Primary Contact**: sutiyonodoang@gmail.com  
**Subject Line**: [SECURITY] Your Security Concern  
**Response Time**: 24 hours for critical issues, 48-72 hours for others  

**Emergency Procedure**: If you discover an active security threat, email immediately with "URGENT SECURITY" in the subject line.

---

## 📄 Legal Notice

This security policy is part of SIWarga application.

**Copyright © 2025 Sutiyono**  
**Email**: sutiyonodoang@gmail.com  
**License**: MIT License - see [LICENSE](LICENSE) file for details.

**Disclaimer**: While we implement comprehensive security measures, no system is 100% secure. This policy outlines our best efforts to maintain security and our commitment to addressing issues promptly.

---

*Last Updated: January 27, 2025*  
*Security Policy Version: 1.0.0*

---

*SIWarga - Sistem Informasi Warga yang aman, terpercaya, dan sesuai standar keamanan modern.*
