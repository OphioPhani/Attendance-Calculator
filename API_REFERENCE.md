# Smart Attendance Calculator - API Reference

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-api.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Token
Login or signup to receive a token in the response.

---

## Endpoints

### Auth Endpoints (Public)

#### 1. Signup
```
POST /auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",  // optional
  "mobile": "9876543210",        // optional
  "password": "password123",
  "confirmPassword": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "mobile": "9876543210"
  }
}
```

#### 2. Login
```
POST /auth/login
Content-Type: application/json

{
  "identifier": "john_doe",  // username, email, or mobile
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "john_doe",
    "email": "john@example.com",
    "mobile": "9876543210"
  }
}
```

---

### Attendance Endpoints (Protected)

#### 3. Get Attendance Record
```
GET /attendance/:semester
Headers: Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "semester": "Sem 3",
    "attendedDates": [
      "2024-01-15",
      "2024-01-16",
      "2024-01-17"
    ],
    "customHolidays": [
      "2024-02-20"
    ],
    "createdAt": "2024-01-10T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

#### 4. Update Attendance
```
POST /attendance/update
Headers: Authorization: Bearer TOKEN
Content-Type: application/json

{
  "semester": "Sem 3",
  "dates": [
    "2024-01-15",
    "2024-01-16"
  ],
  "action": "add"  // or "remove"
}

Response (200):
{
  "success": true,
  "message": "Attendance updated successfully",
  "data": { /* updated attendance object */ }
}
```

#### 5. Add Custom Holiday
```
POST /attendance/add-holiday
Headers: Authorization: Bearer TOKEN
Content-Type: application/json

{
  "semester": "Sem 3",
  "dates": [
    "2024-02-20",
    "2024-02-21"
  ]
}

Response (200):
{
  "success": true,
  "message": "Holiday(s) added successfully",
  "data": { /* updated attendance object */ }
}
```

#### 6. Remove Custom Holiday
```
DELETE /attendance/remove-holiday
Headers: Authorization: Bearer TOKEN
Content-Type: application/json

{
  "semester": "Sem 3",
  "dates": [
    "2024-02-20"
  ]
}

Response (200):
{
  "success": true,
  "message": "Holiday(s) removed successfully",
  "data": { /* updated attendance object */ }
}
```

#### 7. Calculate Attendance Metrics
```
GET /attendance/calculate/:semester?startDate=2024-01-01&endDate=2024-05-31
Headers: Authorization: Bearer TOKEN

Response (200):
{
  "success": true,
  "data": {
    "workingDays": 78,
    "attendedDays": 72,
    "percentage": 92.31,
    "prediction": {
      "classesNeeded": 0,
      "safeMisses": 12,
      "targetPercentage": 75,
      "messageType": "success",
      "message": "You're already above 75%"
    },
    "semester": "Sem 3",
    "startDate": "2024-01-01",
    "endDate": "2024-05-31"
  }
}
```

---

### Health Check (Public)

#### 8. Server Health
```
GET /health

Response (200):
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-20T15:45:00Z",
  "environment": "development"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Semester and dates array are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "No attendance record found for this semester"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already in use"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Data Formats

### Date Format
- Format: `YYYY-MM-DD` (ISO string without time)
- Example: `2024-01-15`

### Semester Values
- Valid values: `Sem 1`, `Sem 2`, `Sem 3`, `Sem 4`, `Sem 5`, `Sem 6`, `Sem 7`, `Sem 8`

### JWT Token
- Format: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Expiration: 7 days
- Stored in: localStorage (client-side)

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "test123",
    "confirmPassword": "test123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test_user",
    "password": "test123"
  }'
```

### Get Attendance (with token)
```bash
curl -X GET http://localhost:5000/api/attendance/Sem%203 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/update \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "semester": "Sem 3",
    "dates": ["2024-01-15", "2024-01-16"],
    "action": "add"
  }'
```

---

## Rate Limiting
- Currently: No rate limiting implemented
- Recommended for production: 100 requests/minute per IP

## CORS
- Allowed Origins: `http://localhost:3000` (development)
- Methods: `GET, POST, PUT, DELETE`
- Headers: `Content-Type, Authorization`

---

## Frontend API Usage Example

```javascript
import { attendanceService } from '@/services/attendanceService.js'

// Get attendance
const data = await attendanceService.getAttendance('Sem 3')

// Update attendance
const updated = await attendanceService.updateAttendance(
  'Sem 3',
  ['2024-01-15', '2024-01-16'],
  'add'
)

// Calculate metrics
const metrics = await attendanceService.calculateMetrics(
  'Sem 3',
  '2024-01-01',
  '2024-05-31'
)
```

---

## Common Status Codes
- `200`: Success (GET, POST, DELETE)
- `201`: Resource Created (Signup)
- `400`: Bad Request (validation error)
- `401`: Unauthorized (no/invalid token)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate entry)
- `500`: Server Error (unexpected error)
