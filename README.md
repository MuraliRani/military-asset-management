# 🛡️ Military Asset Management System

A full-stack **MERN** application designed to streamline the management of military assets across multiple bases. Features include robust **role-based access control**, **JWT authentication**, and full lifecycle tracking of assets such as vehicles, weapons, and equipment.

---

## 🚀 Features

- 🔐 JWT-based User Authentication  
- 👮‍♂️ Role-Based Access Control:  
  - 🛡️ Admin – full access to all modules  
  - 🏢 Base Commander – access to assigned base assets  
  - 🚚 Logistics Officer – purchase, assign, and transfer only  
- 🧾 Manage:  
  - Assets  
  - Purchases  
  - Transfers  
  - Assignments  
  - Bases  
  - Users  
- 📝 Action logging & audit history  
- 💡 Accessible, responsive UI with transitions and animations  
- 📡 RESTful APIs  

---

## 🧰 Tech Stack

| Layer       | Technology             |
|-------------|------------------------|
| 💻 Frontend | React.js (Vite)        |
| 🔙 Backend  | Node.js, Express.js    |
| 🗄️ Database | MongoDB (Atlas/local)   |
| 🔐 Auth     | JSON Web Tokens (JWT)  |

---

## 🛠️ Getting Started (Local)

### ✅ Prerequisites

- Node.js & npm  
- MongoDB (local or Atlas)  

### 📦 Backend Setup

```bash
cd backend
npm install
# Create .env file (see below)
npm start
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 🔐 Environment Variables

In `/backend/.env`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

In `/frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

---

## 🌐 Deployment (Render)

### 📡 Backend (Web Service)

- Root Directory: `backend/`  
- Build Command: `npm install`  
- Start Command: `npm start`  
- Add environment variables as above  

### 🎯 Frontend (Static Site)

- Root Directory: `frontend/`  
- Build Command: `npm run build`  
- Publish Directory: `dist`  
- Set `VITE_API_URL` in `.env` to your backend Render URL  

---

## 👥 Default Admin Login

```
Username: admin
Password: admin123
```

- 🛡️ Admins can add users, assign roles, and manage all data  
- 🔍 All actions are logged in the audit/history panel  

---

## 📁 Project Structure

```
military-asset-management-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── .env
    └── vite.config.js
```


