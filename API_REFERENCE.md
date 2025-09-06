# 🔌 PrepAI API Reference

> **Last Updated**: 2025-09-06  
> **Auto-Generated**: This document is automatically updated when files are added/modified

## 📋 **API Overview**

The PrepAI API provides comprehensive endpoints for authentication, user management, resume analysis, interview scheduling, and multi-tenant operations.

### **Base URLs**
- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.prephired.com`
- **Widget API**: `https://widget.prephired.com/api`

### **Authentication**
All protected endpoints require a Bearer token in the Authorization header:
```http
Authorization: Bearer <jwt-token>
```

---

## 🔐 **Authentication Endpoints**

### **POST /auth/register**
Register a new user account.

**Request Body:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    requiresVerification: boolean;
  };
}
```

### **POST /auth/login**
Authenticate user and return tokens.

**Request Body:**
```typescript
{
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}
```

---

## 📄 **Resume Analysis Endpoints**

### **POST /resume/upload**
Upload resume file for analysis.

**Request:** Multipart form data
```typescript
{
  file: File;  // PDF, DOC, DOCX
  jobDescription?: string;
  analysisType?: 'general' | 'job-specific';
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    resumeId: string;
    fileName: string;
    fileSize: number;
    uploadStatus: 'processing' | 'completed' | 'failed';
    analysisResults?: ResumeAnalysis;
  };
}
```

---

## 🔄 **Auto-Update Information**

This document is automatically updated when:
- New API endpoints are added
- Existing endpoints are modified
- Request/response schemas change
- Error handling is updated

**Last Auto-Update**: 2025-09-06T07:31:01.750Z  
**Update Trigger**: API file changes  
**Next Update**: On next API modification

---

*This API reference is automatically maintained. For manual updates, edit the source files and run the update script.*