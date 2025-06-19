# Military Asset Management System

A full-stack MERN application for managing military assets, with robust role-based access control, JWT authentication, and comprehensive asset, user, and base management.

## Features
- User authentication (JWT)
- Role-based access control (Admin, Base Commander, Logistics Officer)
- Manage assets, purchases, transfers, assignments, bases, and users
- Action logging/history
- Responsive, modern UI with accessibility
- RESTful APIs

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas recommended)
- **Authentication:** JWT

## Getting Started (Local)

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Create a .env file (see below)
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the `backend` directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Deployment (Render)

### Backend
- Create a new Web Service on Render, connect your repo, set root to `backend/`.
- Set build command: `npm install`
- Set start command: `npm start`
- Add environment variables as above.

### Frontend
- Create a new Static Site on Render, set root to `frontend/`.
- Build command: `npm run build`
- Publish directory: `dist`
- Set API base URL in frontend to your Render backend URL.

## Usage
- Default admin login: `admin` / `admin123`
- Admins can add users and manage all data.
- All actions are logged for audit/history.

---

**For more details, see code comments and each directory's README.** 