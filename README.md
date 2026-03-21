# Smart Attendance Calculator

A production-ready web application for managing and calculating student attendance at Matrusri Engineering College.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Deployment**: Vercel (Frontend) + Render (Backend)

## Project Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── styles/        # Global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                 # Node.js backend (Express)
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── controllers/        # Route controllers
    ├── middleware/        # Custom middleware
    ├── config/            # Configuration files
    ├── server.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd attendance-calculator
```

2. Install dependencies for all packages:
```bash
npm run install-all
```

3. Setup environment variables:

**Server (.env)**:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=development
```

**Client (.env)**:
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

**Development (both client and server)**:
```bash
npm run dev
```

**Server only**:
```bash
npm run server
```

**Client only**:
```bash
npm run client
```

## Deployment

For detailed deployment instructions using Vercel (Frontend) + Render (Backend), see **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**.

Quick Summary:
- **Frontend**: Deploy on [Vercel](https://vercel.com)
- **Backend**: Deploy on [Render](https://render.com)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com) (free tier available)

All have free tiers and auto-scale based on usage!

- [x] Project Setup
- [x] Backend Setup (Express + MongoDB)
- [x] Authentication System (JWT-based)
- [x] Auth Middleware (Protected routes)
- [x] Attendance Model & APIs (CRUD operations)
- [x] Attendance Calculation Engine (working days, percentage, prediction)
- [x] Frontend Setup (React + Vite + Tailwind)
- [x] Auth UI (Login/Signup with glassmorphism)
- [x] Dashboard (animated cards, 3D effects)
- [x] Advanced UI Components (TextShimmer, GradientButton, HolographicCard)
- [x] Responsive Design (mobile, tablet, desktop)
- [x] Holiday Management
- [x] API Integration
- [x] Prediction Feature
- [x] UI/UX Polish (dark theme, animations, gradient effects)
- [x] Deployment (Vercel + Render)

## License

MIT
