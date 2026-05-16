# 🛡️ SecureScan AI — Web App Security Testing Tool

A premium cybersecurity SaaS platform for scanning web vulnerabilities, built with React + Node.js + MongoDB.

---

## 📋 Prerequisites

Before running this project, install:

1. **Node.js** (v18+): https://nodejs.org/
2. **MongoDB Community Server**: https://www.mongodb.com/try/download/community

### Installing MongoDB on Windows

1. Go to https://www.mongodb.com/try/download/community
2. Select **Windows**, **MSI** package, and click Download
3. Run the installer → choose **Complete** setup
4. Check ✅ "Install MongoDB as a Service"
5. Check ✅ "Install MongoDB Compass" (optional GUI)
6. Click **Install** and finish

To verify MongoDB is running, open Command Prompt and type:
```
mongosh
```
If you see a `>` prompt, MongoDB is running. Type `exit` to quit.

---

## 🚀 Quick Start

### 1. Clone / Extract the project
```bash
cd SecureScan-AI
```

### 2. Setup Backend
```bash
cd server
copy .env.example .env
npm install
npm run dev
```
Backend runs at: http://localhost:5000

### 3. Setup Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 🔑 Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/securescanai
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 👤 Default Admin Account

After starting the server, register a new account at http://localhost:5173/signup

To make yourself admin, open MongoDB Compass or mongosh:
```js
use securescanai
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 📁 Project Structure

```
SecureScan-AI/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Auth context
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Helpers & API
├── server/          # Node.js + Express backend
│   ├── controllers/ # Route handlers
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth & error middleware
│   └── config/      # DB config
└── README.md
```

---

## 🛠️ Common Errors & Fixes

**MongoDB connection error:**
- Open Services (Win+R → services.msc) → Find "MongoDB" → Start

**Port 5000 already in use:**
- Change PORT in server/.env to 5001

**npm install fails:**
- Delete `node_modules` folder and `package-lock.json`, then retry

**CORS errors:**
- Make sure backend is running before frontend

---

## ✨ Features

- 🔒 JWT Authentication
- 🔍 URL Security Scanner (SSL, Headers, XSS, SQLi, CSRF)
- 📊 Analytics Dashboard with Charts
- 🤖 AI Security Recommendations
- 📄 PDF Report Generation
- 👥 Admin Panel
- 🌑 Dark Cybersecurity Theme
