# Forensic Evidence Analysis Backend API

A production-ready Node.js/Express backend API for a forensic evidence analysis mobile application with MongoDB Atlas integration and JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Testing](#testing)

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Secure password hashing with bcrypt
  - Session management with refresh token rotation
  - Multi-device login support
  - Role-based access control

- **Report Management**
  - Create and manage forensic analysis reports
  - Upload multiple evidence images
  - Store AI chat conversation history
  - Auto-generated unique case IDs (CASE-YYYY-XXXX)
  - Tag-based evidence categorization
  - Pagination and search functionality

- **User Management**
  - User profile management
  - Password change functionality
  - Account deactivation
  - Last login tracking

- **Security**
  - Helmet.js for HTTP security headers
  - CORS with origin whitelist
  - Rate limiting on authentication endpoints
  - Input validation with express-validator
  - SQL injection prevention

- **Production Ready**
  - Comprehensive error handling
  - Request logging with Morgan
  - Database connection retry logic
  - Graceful shutdown handling
  - Standardized API responses

## 🛠 Technology Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **Security:** Helmet, CORS, Bcrypt
- **Logging:** Morgan
- **Development:** Nodemon

## 📁 Project Structure

```
forensic-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection with retry logic
│   │   └── config.js             # Centralized configuration
│   ├── models/
│   │   ├── User.js               # User schema with password hashing
│   │   ├── Report.js             # Forensic report schema
│   │   └── Session.js            # Refresh token sessions
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication endpoints
│   │   ├── report.routes.js      # Report CRUD endpoints
│   │   └── user.routes.js        # User profile endpoints
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication business logic
│   │   ├── report.controller.js  # Report management logic
│   │   └── user.controller.js    # User management logic
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── error.middleware.js   # Global error handler
│   │   └── validate.middleware.js # Input validation
│   ├── utils/
│   │   ├── jwt.utils.js          # Token generation/verification
│   │   ├── response.utils.js     # Standardized responses
│   │   └── asyncHandler.js       # Async error wrapper
│   └── server.js                 # Express app entry point
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account

### Steps

1. **Clone the repository**
   ```bash
   cd forensic-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forensic_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_access_token_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_token_key_min_32_chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:19000,http://localhost:19001,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | See MongoDB Atlas dashboard |
| `JWT_SECRET` | Secret key for access tokens | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | Generate with same command as above |
| `JWT_EXPIRE` | Access token expiry time | `15m`, `1h`, `1d` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry time | `7d`, `30d` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000,http://localhost:19000` |

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace in `MONGODB_URI`

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```
Uses nodemon for automatic server restart on file changes.

### Production Mode
```bash
npm start
```
Runs the server without auto-reload.

### Expected Output
```
==================================================
🚀 Server running in development mode
🌐 Server listening on port 5000
📡 API available at http://localhost:5000
🏥 Health check at http://localhost:5000/health
==================================================
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
📊 Database: forensic_db
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "details": [ /* validation errors */ ]
  }
}
```

---

### Authentication Endpoints

#### 1. Sign Up
**POST** `/api/v1/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "analyst@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters, must contain uppercase, lowercase, and number
- First name and last name required (max 50 characters)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "email": "analyst@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "analyst",
      "isActive": true,
      "createdAt": "2025-11-02T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": "15m"
    }
  }
}
```

---

#### 2. Login
**POST** `/api/v1/auth/login`

Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "analyst@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123...",
      "email": "analyst@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "analyst",
      "lastLogin": "2025-11-02T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": "15m"
    }
  }
}
```

---

#### 3. Refresh Token
**POST** `/api/v1/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "15m"
  }
}
```

---

#### 4. Logout
**POST** `/api/v1/auth/logout`

Invalidate refresh token and logout from current device.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

#### 5. Logout from All Devices
**POST** `/api/v1/auth/logout-all`

**Headers:** `Authorization: Bearer <access_token>`

Invalidate all refresh tokens and logout from all devices.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully",
  "data": {
    "sessionsDeleted": 3
  }
}
```

---

### Report Endpoints

All report endpoints require authentication header:
```
Authorization: Bearer <access_token>
```

#### 1. Create Report
**POST** `/api/v1/reports`

Create a new forensic analysis report.

**Request Body:**
```json
{
  "images": [
    {
      "uri": "file:///path/to/image1.jpg",
      "size": 1024000
    }
  ],
  "chatHistory": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Analyze this evidence",
      "imageUri": "file:///path/to/image1.jpg",
      "timestamp": "2025-11-02T10:00:00.000Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Based on the analysis...",
      "timestamp": "2025-11-02T10:00:05.000Z"
    }
  ],
  "reportContent": "Detailed forensic analysis report...",
  "evidenceTags": ["fingerprint", "bloodstain"],
  "status": "completed"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {
    "_id": "65abc456...",
    "userId": "65abc123...",
    "caseId": "CASE-2025-0001",
    "images": [...],
    "chatHistory": [...],
    "reportContent": "...",
    "evidenceTags": ["fingerprint", "bloodstain"],
    "summary": "Detailed forensic analysis...",
    "status": "completed",
    "imageCount": 1,
    "messageCount": 2,
    "createdAt": "2025-11-02T10:00:00.000Z",
    "updatedAt": "2025-11-02T10:00:00.000Z"
  }
}
```

---

#### 2. Get All Reports
**GET** `/api/v1/reports`

Get all reports for authenticated user with pagination.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (draft/completed)
- `search` - Search in caseId, summary, or tags

**Example:**
```
GET /api/v1/reports?page=1&limit=10&status=completed&search=fingerprint
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "data": [
    {
      "_id": "65abc456...",
      "caseId": "CASE-2025-0001",
      "images": [...],
      "evidenceTags": ["fingerprint"],
      "summary": "Detailed forensic analysis...",
      "status": "completed",
      "imageCount": 1,
      "createdAt": "2025-11-02T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

#### 3. Get Report by ID
**GET** `/api/v1/reports/:id`

Get single report with full details.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Report retrieved successfully",
  "data": {
    "_id": "65abc456...",
    "userId": "65abc123...",
    "caseId": "CASE-2025-0001",
    "images": [...],
    "chatHistory": [...],
    "reportContent": "...",
    "evidenceTags": [...],
    "summary": "...",
    "status": "completed",
    "createdAt": "2025-11-02T10:00:00.000Z",
    "updatedAt": "2025-11-02T10:00:00.000Z"
  }
}
```

---

#### 4. Update Report
**PUT** `/api/v1/reports/:id`

Update an existing report (append chat messages, update status, etc.).

**Request Body:**
```json
{
  "chatHistory": [
    {
      "id": "msg-3",
      "role": "user",
      "content": "Additional question",
      "timestamp": "2025-11-02T11:00:00.000Z"
    }
  ],
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Report updated successfully",
  "data": { /* updated report */ }
}
```

---

#### 5. Delete Report
**DELETE** `/api/v1/reports/:id`

Delete a report permanently.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Report deleted successfully",
  "data": {
    "id": "65abc456..."
  }
}
```

---

#### 6. Get Report Statistics
**GET** `/api/v1/reports/stats`

Get report statistics for authenticated user.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 10,
    "draft": 3,
    "completed": 7
  }
}
```

---

### User Profile Endpoints

All user endpoints require authentication header.

#### 1. Get Profile
**GET** `/api/v1/users/profile`

Get current user profile.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "65abc123...",
    "email": "analyst@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "role": "analyst",
    "isActive": true,
    "lastLogin": "2025-11-02T10:00:00.000Z",
    "createdAt": "2025-11-01T10:00:00.000Z",
    "updatedAt": "2025-11-02T10:00:00.000Z"
  }
}
```

---

#### 2. Update Profile
**PUT** `/api/v1/users/profile`

Update user profile information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "newemil@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user profile */ }
}
```

---

#### 3. Change Password
**PUT** `/api/v1/users/password`

Change user password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

---

#### 4. Deactivate Account
**DELETE** `/api/v1/users/account`

Deactivate user account (soft delete).

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deactivated successfully",
  "data": null
}
```

---

### Health Check Endpoint

#### Health Check
**GET** `/health`

Check server health status.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "data": {
    "status": "healthy",
    "timestamp": "2025-11-02T10:00:00.000Z",
    "environment": "development"
  }
}
```

---

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing with 12 salt rounds
   - Minimum 8 characters with complexity requirements
   - Password never exposed in API responses

2. **JWT Authentication**
   - Separate secrets for access and refresh tokens
   - Short-lived access tokens (15 minutes)
   - Longer-lived refresh tokens (7 days)
   - Refresh token rotation

3. **Rate Limiting**
   - 5 requests per 15 minutes on auth endpoints
   - Prevents brute force attacks

4. **Security Headers**
   - Helmet.js for HTTP security headers
   - XSS protection
   - MIME type sniffing prevention

5. **CORS**
   - Origin whitelist configuration
   - Credentials support

6. **Input Validation**
   - Express Validator on all endpoints
   - SQL injection prevention
   - XSS prevention

## 🛡️ Error Handling

The API implements comprehensive error handling:

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": [ /* additional error details */ ]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### Common Error Scenarios

1. **Validation Error**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```

2. **Authentication Error**
```json
{
  "success": false,
  "error": {
    "message": "Access token has expired",
    "statusCode": 401
  }
}
```

3. **Authorization Error**
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this report",
    "statusCode": 403
  }
}
```

## 🧪 Testing

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Import the following collection:

**Create New User:**
```
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123",
  "firstName": "Test",
  "lastName": "User"
}
```

**Login:**
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123"
}
```

**Create Report (with auth token):**
```
POST http://localhost:5000/api/v1/reports
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reportContent": "Test forensic report",
  "evidenceTags": ["test"],
  "status": "draft"
}
```

### Using Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new collection
3. Add environment variables:
   - `base_url`: `http://localhost:5000/api/v1`
   - `access_token`: (will be set after login)
4. Use the API documentation above to create requests

### Testing Workflow

1. **Sign up** → Save access token
2. **Login** → Save access and refresh tokens
3. **Create Report** → Use access token
4. **Get Reports** → Verify pagination
5. **Update Report** → Test partial updates
6. **Refresh Token** → Get new access token
7. **Logout** → Invalidate session

## 📝 Development Notes

### Code Style
- ES6+ features (const/let, arrow functions, destructuring)
- Async/await for all async operations
- JSDoc comments for complex functions
- Modular architecture with single responsibility

### Database Indexes
Optimized indexes for:
- User email lookups
- Report queries by userId
- Session queries by userId and expiry
- Case ID uniqueness

### Logging
- Development: Detailed console logs with Morgan 'dev' format
- Production: Combined format logs

### Environment-Specific Behavior
- Development: Full error stack traces
- Production: Sanitized error messages

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Validate all inputs
4. Write meaningful commit messages
5. Test thoroughly before committing

## 📄 License

ISC

## 📞 Support

For issues and questions:
- Review API documentation above
- Check environment variable configuration
- Verify MongoDB Atlas connection
- Check server logs for detailed error messages

---

**Built with ❤️ for Forensic Analysis**
