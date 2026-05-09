# Public Complaint Tracking System (PCTS) - Development Build

A comprehensive, full-stack application built to track and manage civic duties. This repository contains both the React frontend and Node.js backend to offer a beautiful, seamless, and performant web experience.

## Overview
1. **Frontend**: React 18, Vite, Tailwind CSS v3 (Custom config), React Router v6, React Hook Form + Zod for validation, Recharts for Admin Dashboards, Lucide Icons.
2. **Backend**: Node.js, Express.js.
3. **Database**: PostgreSQL (Raw SQL queries via `pg`).

---

## 📁 Project Structure

```text
pcts/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── api/            # Axios API configurations
│   │   ├── assets/         # Images and SVG assets
│   │   ├── components/     # Reusable UI & Layout components
│   │   ├── context/        # React Context providers (AuthContext)
│   │   ├── pages/          # Full page views (Home, Dashboard, etc.)
│   │   ├── App.jsx         # Main App routing component
│   │   └── main.jsx        # React DOM entry point
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js      # Vite build configuration
└── server/                 # Node.js + Express Backend
    ├── controllers/        # Request handlers (Admin, Auth, Complaints)
    ├── db/                 # Database configuration & schema
    ├── middleware/         # Express middlewares (Auth, Upload)
    ├── routes/             # API Route definitions
    ├── uploads/            # Uploaded media files
    ├── .env.example        # Environment variables template
    ├── app.js              # Express application entry point
    └── package.json        # Backend dependencies
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally.

### 1. Database Setup
1. Create a database named `pcts` in PostgreSQL.
2. Run the schema creation script on the new database:
   ```bash
   psql -U postgres -d pcts -f server/db/schema.sql
   ```

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file referencing `.env.example`:
   ```env
   PORT=5000
   DATABASE_URL=postgres://youruser:yourpassword@localhost:5432/pcts
   JWT_SECRET=supersecretjwtkey_pcts
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the server: `node app.js` (Server runs on port 5000)

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev` (Runs on port 5173)

---

## 🔑 Demo & Testing
**Creating an Admin:**
1. Try registering as a new user via the interface.
2. Connect to your database using `psql` or `pgAdmin` and update the role:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your.email@example.com';
   ```
3. Log out and log back in on the frontend to access the Admin Dashboard.

## Visual Aesthetics Built-In:
- ✅ Sleek Dark/Light responsive glassmorphic cards.
- ✅ Floating validation states & dynamic Password Strength meters.
- ✅ Custom visual Timeline components for complaint lifecycle mapping.

**Author:** 108harsh - guptaharsh1969@gmail.com
