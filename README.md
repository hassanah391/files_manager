# Files Manager

A simple file management API built with Node.js, Express, MongoDB, and Redis. This project provides endpoints for user authentication, file upload, and file management with proper authentication and authorization.

## 🚀 Features

- **User Authentication**: Secure user registration and login with SHA1 password hashing
- **Token-based Authentication**: JWT-like tokens stored in Redis with 24-hour expiration
- **File Management**: Upload, retrieve, and manage files with proper permissions
- **Database Integration**: MongoDB for data persistence with Redis for session management
- **Background Processing**: Bull queue integration for file processing tasks
- **RESTful API**: Clean, well-documented REST endpoints

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **Redis** (v6.0 or higher)
- **npm** or **yarn**

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd files_manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=27017
   DB_DATABASE=files_manager
   FOLDER_PATH=/tmp/files_manager
   ```

4. **Start MongoDB and Redis**
   ```bash
   # Start MongoDB (make sure it's running on localhost:27017)
   sudo systemctl start mongod
   
   # Start Redis (make sure it's running on localhost:6379)
   sudo systemctl start redis
   ```

5. **Start the server**
   ```bash
   npm run start-server
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. Create a New User
**POST** `/users`

Creates a new user account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "id": "5f1e7cda04a394508232559d",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400` - Missing email or password
- `400` - User already exists

**Example:**
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@dylan.com", "password": "toto1234!"}'
```

#### 2. Authenticate User
**GET** `/connect`

Authenticates a user using Basic Authentication and returns an access token.

**Headers:**
```
Authorization: Basic <base64-encoded-email:password>
```

**Success Response (200):**
```json
{
  "token": "031bffac-3edc-4e51-aaae-1c121317da8a"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

**Example:**
```bash
# Encode credentials: echo -n "bob@dylan.com:toto1234!" | base64
curl -X GET http://localhost:5000/connect \
  -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="
```

#### 3. Get User Profile
**GET** `/users/me`

Retrieves the current user's profile using the authentication token.

**Headers:**
```
X-Token: <authentication-token>
```

**Success Response (200):**
```json
{
  "id": "5f1e7cda04a394508232559d",
  "email": "bob@dylan.com"
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/users/me \
  -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a"
```

#### 4. Sign Out User
**GET** `/disconnect`

Signs out a user by invalidating their authentication token.

**Headers:**
```
X-Token: <authentication-token>
```

**Success Response (204):**
```
(Empty response body)
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/disconnect \
  -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a"
```

### System Endpoints

#### 5. Get System Status
**GET** `/status`

Returns the status of Redis and MongoDB connections.

**Success Response (200):**
```json
{
  "redis": true,
  "db": true
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/status
```

#### 6. Get System Statistics
**GET** `/stats`

Returns the number of users and files in the database.

**Success Response (200):**
```json
{
  "users": 5,
  "files": 12
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/stats
```

## 🔧 Project Structure

```
files_manager/
├── controllers/          # Route controllers
│   ├── AppController.js  # System status and stats
│   ├── AuthController.js # Authentication endpoints
│   └── UsersController.js # User management
├── routes/               # API routes
│   └── index.js         # Route definitions
├── utils/               # Utility modules
│   ├── db.js           # MongoDB client
│   ├── redis.js        # Redis client
│   ├── user.js         # User utilities
│   └── basic.js        # Basic utilities
├── server.js           # Express server entry point
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🛡️ Security Features

- **Password Hashing**: All passwords are hashed using SHA1 before storage
- **Token-based Authentication**: Secure tokens with 24-hour expiration
- **Input Validation**: Comprehensive validation for all user inputs
- **Error Handling**: Proper error responses without exposing sensitive information

## 🚀 Development

### Available Scripts

- `npm run start-server` - Start the development server with nodemon
- `npm run start-worker` - Start the background worker
- `npm run dev` - Start in development mode
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // SHA1 hashed
  createdAt: Date
}
```

#### Files Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  type: String,
  isPublic: Boolean,
  parentId: ObjectId,
  localPath: String
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of the ALX Software Engineering program.

## 👨‍💻 Author

**Hassan** - ALX Student

---

## 🧪 Testing the API

Here's a complete workflow to test the API:

```bash
# 1. Create a new user
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# 2. Authenticate and get token
curl -X GET http://localhost:5000/connect \
  -H "Authorization: Basic dGVzdEBleGFtcGxlLmNvbTpwYXNzd29yZDEyMw=="

# 3. Get user profile (use token from step 2)
curl -X GET http://localhost:5000/users/me \
  -H "X-Token: YOUR_TOKEN_HERE"

# 4. Check system status
curl -X GET http://localhost:5000/status

# 5. Get system stats
curl -X GET http://localhost:5000/stats

# 6. Sign out
curl -X GET http://localhost:5000/disconnect \
  -H "X-Token: YOUR_TOKEN_HERE"
```

For more information, check the individual endpoint documentation above.
