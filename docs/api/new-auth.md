## **1. Core Authentication**

### **1.1 User Registration**

**Endpoint:** `POST /api/auth/register` **Purpose:** Create a new user account
(supports tenant creation & invitations).

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+15551234567",
  "password": "Password123",
  "confirmPassword": "Password123",
  "acceptTerms": true,
  "tenantSlug": "my-company",
  "invitationToken": "optional-token"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "emailVerified": false
  }
}
```

**Status Codes:** `201` Created | `400` Validation error | `409` User exists

---

### **1.2 User Login**

**Endpoint:** `POST /api/auth/login` **Purpose:** Authenticate with email/phone
and password.

**Request Body:**

```json
{
  "emailOrPhone": "john@example.com",
  "password": "Password123",
  "rememberMe": true
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "roles": ["user"],
    "permissions": ["read", "write"]
  },
  "session": {
    "id": "session-id",
    "token": "jwt-token",
    "refreshToken": "refresh-token",
    "expiresAt": "2025-08-12T10:00:00Z"
  }
}
```

---

### **1.3 Validate Session**

**Endpoint:** `POST /api/auth/session` **Purpose:** Validate current access
token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "session": {
    "id": "session-id",
    "expiresAt": "2025-08-12T10:00:00Z"
  }
}
```

---

### **1.4 Refresh Tokens**

**Endpoint:** `POST /api/auth/refresh` **Purpose:** Refresh access & refresh
tokens.

**Request Body:**

```json
{
  "refreshToken": "refresh-token"
}
```

---

### **1.5 Logout**

**Endpoint:** `POST /api/auth/logout` **Purpose:** End session & invalidate
tokens.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "refreshToken": "refresh-token"
}
```

---

## **2. Password Management**

### **2.1 Forgot Password**

**Endpoint:** `POST /api/auth/forgot-password` **Purpose:** Send reset link/OTP
to email or phone.

**Request Body:**

```json
{
  "emailOrPhone": "john@example.com"
}
```

---

### **2.2 Reset Password**

**Endpoint:** `POST /api/auth/reset-password` **Purpose:** Reset password using
token from email/SMS.

**Request Body:**

```json
{
  "token": "reset-token",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

---

### **2.3 Change Password**

**Endpoint:** `POST /api/auth/change-password` **Purpose:** Change password for
authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123",
  "confirmPassword": "NewPass123"
}
```

---

## **3. Verification**

### **3.1 Verify Email**

**Endpoint:** `POST /api/auth/verify-email` **Purpose:** Confirm email address
via token.

**Request Body:**

```json
{
  "token": "verification-token"
}
```

---

### **3.2 Resend Email Verification**

**Endpoint:** `POST /api/auth/resend-verification`

**Headers:**

```
Authorization: Bearer <access_token>
```

---

### **3.3 Verify Phone**

**Endpoint:** `POST /api/auth/verify-phone`

**Request Body:**

```json
{
  "phone": "+15551234567",
  "otp": "123456"
}
```

---

### **3.4 Send Phone OTP**

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**

```json
{
  "phone": "+15551234567"
}
```

---

## **4. Profile Management**

### **4.1 Get Profile**

**Endpoint:** `GET /api/auth/profile`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

### **4.2 Update Profile**

**Endpoint:** `PUT /api/auth/profile`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "firstName": "Johnny",
  "lastName": "Smith",
  "phoneNumber": "+15557654321"
}
```
