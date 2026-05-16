# 🚀 Task Flow Management System

A high-performance, responsive task management application built with **TypeScript**, **React**, **Node.js**, and **Prisma**.

---

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (for production) or **SQLite** (for quick local setup)

---

## 📦 1. Clone the Project

```bash
git clone https://github.com/pandascrush/task_management.git
cd task_management
```

---

## 🖥️ 2. Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/task_db"
JWT_SECRET="your_super_secret_key"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

### Initialize Database
```bash
npx prisma migrate dev --name init
npm run db:seed
```

### Start Backend
```bash
npm run dev
```

---

## 🎨 3. Frontend Setup

### Install Dependencies
```bash
cd ../frontend
npm install
```

### Configure Environment Variables
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL="http://localhost:5000/api/v1"
```

### Start Frontend
```bash
npm run dev
```

---

## 🔐 4. Access the Application

Once both servers are running:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api/v1`

### Default Admin Credentials (from Seed)
- **Email**: `admin@admin.com`
- **Password**: `admin123`

---

## ☁️ 5. Production Deployment

### Backend (Render.com)
1. Use the included `render.yaml` to deploy via **Blueprints**.
2. Render will automatically provision a PostgreSQL database and link it.
3. The server will run migrations and seed automatically on startup.

### Frontend (Vercel)
1. Import the `frontend` folder to Vercel.
2. Set the `VITE_API_URL` environment variable to your Render Backend URL.
3. Vercel will handle the rest via the `vercel.json` configuration.

---

## 🛡 Security Features
- **JWT Authentication**: Secure token-based access.
- **Role-Based Access Control (RBAC)**: Distinct Admin and User dashboards.
- **XSS Protection**: Sanitized inputs.
- **Rate Limiting**: Brute-force protection.
- **Persistent Logging**: Daily rotating logs for audit trails.