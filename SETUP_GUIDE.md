# Smart Attendance Calculator - Setup & Deployment Guide

## Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- MongoDB Atlas account ([Create Free](https://www.mongodb.com/cloud/atlas))
- Git

## Local Development Setup

### 1. Install Node.js & npm
```bash
# Check if installed
node --version
npm --version
```

### 2. Install Project Dependencies
```bash
cd /path/to/Attendance\ Calculator
npm run install-all
```

### 3. Setup Environment Variables

**Server (.env)**:
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-calculator?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_secret_key_min_32_characters_long
PORT=5000
NODE_ENV=development
```

**Client (.env)**:
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

### 4. Setup MongoDB Atlas

1. Create a cluster on MongoDB Atlas
2. Create a database user with username & password
3. Add your IP address to Network Access whitelist
4. Get connection string and update `MONGODB_URI` in `server/.env`

### 5. Run Development Servers

**Both client and server together**:
```bash
npm run dev
```

**Server only** (port 5000):
```bash
npm run server
```

**Client only** (port 3000, proxies to localhost:5000):
```bash
npm run client
```

## Project Structure

```
Attendance Calculator/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/                  # Page components: Login, Signup, Dashboard
│   │   ├── components/             # Reusable: FormComponents, ProtectedRoute
│   │   ├── hooks/                  # Custom: useAuth, useAttendance
│   │   ├── services/               # API: api.js, attendanceService.js
│   │   ├── styles/                 # Global CSS with Tailwind
│   │   ├── App.jsx                 # Main app with routing
│   │   └── main.jsx                # Entry point
│   ├── index.html                  # HTML template
│   ├── package.json
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── postcss.config.js
│
├── server/                          # Express Backend
│   ├── models/                     # MongoDB: User.js, Attendance.js
│   ├── controllers/                # Business logic for routes
│   ├── routes/                     # API endpoints definitions
│   ├── middleware/                 # Auth, error handling
│   ├── config/                     # Database connection
│   ├── utils/                      # Utility functions (attendance calc)
│   ├── server.js                   # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .env                        # (env vars - don't commit)
│
├── package.json                     # Root scripts
├── .gitignore                       # Git ignore rules
└── README.md                        # Project overview
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Attendance (Protected)
- `GET /api/attendance/:semester` - Get attendance record
- `POST /api/attendance/update` - Add/remove attended dates
- `POST /api/attendance/add-holiday` - Add custom holidays
- `DELETE /api/attendance/remove-holiday` - Remove custom holidays
- `GET /api/attendance/calculate/:semester` - Calculate metrics

## Features Implemented

### Backend ✅
- [x] User authentication (signup/login with bcrypt hashing)
- [x] JWT token generation & validation
- [x] Attendance CRUD operations
- [x] Holiday management (Telangana holidays + custom)
- [x] Attendance calculation engine (working days, percentage, prediction)
- [x] Protected routes with middleware
- [x] Error handling middleware
- [x] MongoDB models with validation

### Frontend ✅
- [x] Login page with glassmorphism UI
- [x] Signup page with form validation
- [x] Protected routes
- [x] Auth hooks (useAuth, useAttendance)
- [x] API service layer with axios
- [x] Dark theme with Tailwind CSS
- [x] Framer Motion animations
- [x] Responsive design

### Pending
- [ ] Dashboard with metrics display
- [ ] Interactive calendar component
- [ ] Attendance charts (Recharts)
- [ ] Holiday management UI
- [ ] Prediction feature display
- [ ] Settings/preferences page
- [ ] Mobile optimization
- [ ] Deployment to production

## Troubleshooting

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001
```

### MongoDB Connection Failed
- Check MongoDB Atlas IP whitelist
- Verify connection string in `.env`
- Ensure database user credentials are correct

### Dependencies Installation Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm run install-all
```

### CORS Errors
- Ensure client VITE_API_URL matches server PORT
- Check CORS middleware in server.js

## Production Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy 'dist' folder to Vercel
```

### Backend (Render)
```bash
# Connect GitHub repository to Render
# Add environment variables in Render dashboard
# Deploy from main branch
```

### Database (MongoDB Atlas)
- Already cloud-hosted
- Just ensure production URI is used in production .env

## Testing API Endpoints

### Using cURL
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123","confirmPassword":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test","password":"test123"}'

# Get Attendance (with JWT token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/attendance/Sem%203
```

### Using Postman
1. Import the API endpoints from Postman collection
2. Set base URL to `http://localhost:5000`
3. Add JWT token to Authorization header in requests

## Performance Optimization Tips
- Enable API response caching
- Implement pagination for large datasets
- Use database indexes for frequently queried fields
- Minify frontend assets (Vite does this automatically)
- Enable gzip compression in Express

## Security Best Practices
- Keep JWT_SECRET secure and complex (min 32 chars)
- Use HTTPS in production
- Validate and sanitize all inputs
- Enable CORS only for trusted domains
- Use environment variables for sensitive data
- Keep dependencies updated: `npm audit fix`

## Next Steps
1. Run `npm run dev` to start development
2. Visit `http://localhost:3000/login`
3. Create an account
4. Implement remaining dashboard features
5. Test all functionality before deployment
