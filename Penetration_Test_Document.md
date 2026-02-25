# Penetration Testing Documentation
## Leeds Web Application - Security Assessment Report

---

## 1. Executive Summary

This document provides a comprehensive security assessment of the Leeds Web Application - a fintech payment approval system developed by AeroAssist. The assessment covers authentication mechanisms, authorization controls, data protection, and infrastructure security.

**Application Overview:**
- **Type:** Full-stack fintech web application
- **Architecture:** Microservices (Auth, Invoice, File services)
- **Frontend:** Angular 17
- **Backend:** Node.js with Express
- **Database:** PostgreSQL (3 separate databases)
- **Authentication:** JWT-based token authentication

---

## 2. Application Architecture

### 2.1 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Angular 17 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
|MQ 3 |
 Message Queue | Rabbit| Container | Docker |

### 2.2 Service Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Angular)                       │
│                     https://test-leeds-webapp-api.aeroassist.in │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway (Port 3000)                     │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌───────────────┐
│ Auth Service  │     │ Invoice Service │     │ File Service  │
│  (Port 3001) │     │   (Port 3002)   │     │  (Port 3003)  │
└───────────────┘     └─────────────────┘     └───────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌─────────────────┐     ┌───────────────┐
│  PostgreSQL   │     │   PostgreSQL    │     │   PostgreSQL  │
│  (Auth DB)    │     │ (Invoice DB)    │     │  (File DB)    │
└───────────────┘     └─────────────────┘     └───────────────┘
```

### 2.3 API Endpoints Summary

**Auth Service (Port 3001):**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user

**Invoice Service (Port 3002):**
- Invoice CRUD operations
- Performa Invoice management
- Invoice status updates
- Approval workflows

**File Service (Port 3003):**
- File upload/download
- File validation
- S3 integration (if configured)

---

## 3. Security Assessment Findings

### 3.1 Authentication & Session Management

#### 3.1.1 JWT Token Implementation ✓ SECURE

**Finding:** JWT tokens are properly implemented with the following characteristics:

| Parameter | Value | Assessment |
|-----------|-------|------------|
| Algorithm | HS256 | Secure |
| Access Token Expiry | 15 minutes | Good |
| Refresh Token Expiry | 7 days | Acceptable |
| Token Storage | Client-side (localStorage) | Medium Risk |
| Token Validation | Server-side with user lookup | Good |

**Code Reference (Backend/auth-service/models/user.js):**
```
javascript
User.prototype.generateToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: this.id, email: this.email, roleId: this.roleId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};
```

**Recommendations:**
1. Consider using httpOnly cookies for token storage instead of localStorage to prevent XSS token theft
2. Implement token rotation on refresh
3. Add token revocation mechanism for logout

---

#### 3.1.2 Password Security ✓ SECURE

**Finding:** Passwords are properly hashed using bcrypt

| Parameter | Value | Assessment |
|-----------|-------|------------|
| Hash Algorithm | Bcrypt | Secure |
| Salt Rounds | 10 | Good |
| Min Password Length | 8 characters | Acceptable |
| Password Validation | Joi validation | Good |

**Code Reference (Backend/auth-service/models/user.js):**
```
javascript
const hashedPassword = await bcrypt.hash(data.password, 10);
```

**Recommendations:**
1. Implement password complexity requirements (uppercase, lowercase, numbers, special characters)
2. Add password history check to prevent reuse
3. Consider implementing MFA for admin accounts

---

#### 3.1.3 Account Lockout Mechanism ✓ SECURE

**Finding:** Account lockout is properly implemented

| Parameter | Value | Assessment |
|-----------|-------|------------|
| Max Failed Attempts | 5 | Good |
| Lockout Duration | 15 minutes | Good |
| Auto-reset | After lockout period | Good |

**Code Reference (Backend/auth-service/controllers/authController.js):**
```
javascript
if (user.failedLoginAttempts >= (process.env.PASSWORD_MAX_ATTEMPTS || 5)) {
  const lockoutTime = parseInt(process.env.PASSWORD_LOCKOUT_TIME) || 900000;
  const timeSinceLastAttempt = new Date() - user.updatedAt;
  
  if (timeSinceLastAttempt < lockoutTime) {
    return res.status(423).json({ 
      success: false, 
      message: 'Account is locked. Try again later.' 
    });
  }
}
```

---

### 3.2 Authorization & Access Control

#### 3.2.1 Role-Based Access Control (RBAC) ✓ IMPLEMENTED

**Finding:** Role-based authorization is implemented across services

**Code Reference (Backend/auth-service/middleware/auth.js):**
```
javascript
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};
```

**Recommendations:**
1. Implement principle of least privilege
2. Add audit logging for permission denied events
3. Regular review of role permissions

---

### 3.3 Input Validation

#### 3.3.1 Server-Side Validation ✓ IMPLEMENTED

**Finding:** Input validation is implemented using Joi validation library

**Code Reference (Backend/auth-service/validations/authValidation.js):**
```
javascript
const registerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(parseInt(process.env.PASSWORD_MIN_LENGTH) || 8)
    .required(),
  name: Joi.string().min(2).max(100).required(),
  empNo: Joi.string().optional(),
  roleId: Joi.number().integer().min(1).optional()
});
```

**Recommendations:**
1. Add length limits to prevent DoS via large payloads
2. Implement CSRF protection
3. Add rate limiting on all endpoints

---

### 3.4 API Security

#### 3.4.1 Authentication Middleware

**Auth Service (Backend/auth-service/middleware/auth.js):**
- JWT verification with secret key
- User existence and active status check
- Proper error handling for expired/invalid tokens
- Rate limiting NOT visible - **RECOMMEND ADDING**

**Invoice Service (Backend/invoice-service/middleware/authToken.js):**
- JWT verification
- Additional validation via auth service call
- **Potential Issue:** Makes synchronous call to auth service for each request

**File Service (Backend/file-service/middleware/auth.js):**
- Similar JWT implementation as auth service

---

### 3.5 Data Protection

#### 3.5.1 Database Security

**Configuration (Backend/auth-service/config/database.js):**
- Uses Sequelize ORM
- Connection pooling enabled
- PostgreSQL dialect

**Concerns Found:**
1. Database credentials visible in docker-compose.yaml - **HIGH RISK**
2. No visible encryption at rest
3. No visible database audit logging

**docker-compose.yaml Exposure:**
```
yaml
postgres-auth:
  image: postgres:15
  environment:
    POSTGRES_DB: leeds_payment_auth_db
    POSTGRES_USER: oac_softwares
    POSTGRES_PASSWORD: AWTGBVHYTUOKJK25690  # EXPOSED
```

---

#### 3.5.2 File Upload Security ✓ SECURE

**Finding:** File upload is properly secured

| Parameter | Value | Assessment |
|-----------|-------|------------|
| Allowed Types | JPEG, PNG, PDF, TXT | Good |
| Max File Size | 10 MB | Good |
| Storage | Memory (then S3) | Good |

**Code Reference (Backend/file-service/upload.middleware.js):**
```
javascript
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain'
];
```

**Recommendations:**
1. Implement virus scanning for uploaded files
2. Add file name sanitization
3. Consider storing files outside web root

---

### 3.6 Email Security

#### 3.6.1 Email Service Configuration

**Finding:** Nodemailer is used with Gmail SMTP

**Code Reference (Backend/auth-service/utils/emailService.js):**
```
javascript
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

**Concerns:**
1. Email credentials stored in environment variables - Good
2. Hardcoded admin email in controller - Medium Risk:
```
javascript
await sendApprovalRequestEmail({
  to: 'nishida@onboardaero.com',  // Hardcoded
  ...
});
```

**Recommendations:**
1. Use environment variable for admin email
2. Consider using dedicated email service (SendGrid, AWS SES)
3. Implement SPF, DKIM, DMARC records

---

### 3.7 Infrastructure Security

#### 3.7.1 Container Security

**Docker Configuration:**
- Services properly isolated in containers
- No privileged containers detected
- No secrets in Dockerfiles

**Concerns:**
1. Database credentials in docker-compose.yaml
2. No network segmentation between services
3. No visible security scanning for containers

---

## 4. Vulnerability Summary

| Category | Severity | Status |
|----------|----------|--------|
| Database Credential Exposure | HIGH | Found |
| Missing Rate Limiting | HIGH | Not Found |
| Hardcoded Email Addresses | MEDIUM | Found |
| Missing CSRF Protection | MEDIUM | Not Found |
| Token Storage (localStorage) | MEDIUM | Found |
| Missing WAF | MEDIUM | Not Found |
| No MFA Implementation | MEDIUM | Not Found |
| Insecure Direct Object References | LOW | Not Tested |
| Missing Security Headers | LOW | Not Verified |

---

## 5. Testing Recommendations

### 5.1 Pre-Pen Test Checklist

Before conducting penetration testing, ensure:

- [ ] Obtain written authorization
- [ ] Define scope and boundaries
- [ ] Establish communication channels
- [ ] Set up staging/test environment
- [ ] Backup all data
- [ ] Define rules of engagement
- [ ] Review and accept testing methodology

### 5.2 Recommended Testing Tools

| Category | Tools |
|----------|-------|
| Web Vulnerability | OWASP ZAP, Burp Suite |
| API Testing | Postman, SoapUI |
| Password Cracking | Hashcat, John the Ripper |
| Network Scanning | Nmap, Nessus |
| Code Analysis | SonarQube, Snyk |

### 5.3 Testing Scope

**In-Scope:**
1. Authentication mechanisms
2. Authorization controls
3. Session management
4. Input validation
5. API endpoints
6. File upload functionality
7. Database security

**Out of Scope:**
1. Denial of Service testing (unless authorized)
2. Social engineering
3. Physical security
4. Third-party services (Gmail, etc.)

---

## 6. Remediation Priority

### Phase 1 (Critical - Before Production)
1. Remove hardcoded credentials from docker-compose.yaml
2. Implement rate limiting on all API endpoints
3. Move admin emails to environment variables
4. Implement CSRF protection

### Phase 2 (High - Before Launch)
1. Implement MFA for admin accounts
2. Switch to httpOnly cookies for token storage
3. Add security headers (CSP, HSTS, X-Frame-Options)
4. Implement WAF

### Phase 3 (Medium - Post-Launch)
1. Add comprehensive audit logging
2. Implement database encryption at rest
3. Add file upload virus scanning
4. Regular security code reviews

---

## 7. Compliance Considerations

This application should comply with:
- **GDPR** - Data protection for EU users
- **PCI DSS** - If handling payment card data
- **SOC 2** - Security, availability, confidentiality

---

## 8. Conclusion

The Leeds Web Application demonstrates a solid security foundation with proper JWT authentication, password hashing, and role-based access control. However, several security improvements are recommended before production deployment, particularly:

1. **Critical:** Secure database credentials
2. **High Priority:** Rate limiting and CSRF protection
3. **Medium Priority:** MFA implementation and token storage improvements

The application architecture is well-structured using microservices, which provides good isolation between components. With the recommended security enhancements, the application will be better positioned for production deployment.

---

## Appendix A: Test Environment Details

| Parameter | Value |
|-----------|-------|
| API Base URL | https://test-leeds-webapp-api.aeroassist.in/api |
| Auth Service | Port 3001 |
| Invoice Service | Port 3002 |
| File Service | Port 3003 |
| Database | PostgreSQL 15 |
| Frontend URL | test.leedsaerospace.com (referenced) |

## Appendix B: Code Review Checklist

- [x] Authentication mechanisms
- [x] Password storage and handling
- [x] Session management
- [x] Input validation
- [x] Authorization and access control
- [x] Error handling and logging
- [x] File upload handling
- [x] API security
- [x] Database security
- [x] Configuration management
- [ ] Dependency vulnerability scanning
- [ ] Static application security testing (SAST)
- [ ] Dynamic application security testing (DAST)

---

**Document Version:** 1.0  
**Created Date:** 2024  
**Prepared By:** Security Assessment Team  
**Review Status:** Draft for Internal Review
