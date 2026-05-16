---
name: react-structure
description: >
  React + Vite project structure for the Task Management System frontend.
  Use when scaffolding the frontend, creating components, or organizing pages.
---

# React Structure — Frontend

## Tech Stack

- **Framework:** React 18+ with Vite
- **Routing:** React Router v6
- **HTTP:** Axios
- **State:** React Context
- **Styling:** Vanilla CSS with design tokens
- **Toasts:** react-hot-toast
- **Icons:** react-icons (Lucide set)

## Project Layout

```
frontend/
├── .agents/skills/
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.api.js
│   │   ├── user.api.js
│   │   └── task.api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   ├── common/
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskStatusBadge.jsx
│   │   ├── UserForm.jsx
│   │   ├── TaskForm.jsx
│   │   └── AssignTaskModal.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.css
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminDashboard.css
│   │   └── user/
│   │       ├── UserDashboard.jsx
│   │       └── UserDashboard.css
│   └── utils/
│       └── constants.js
├── .env
├── index.html
├── vite.config.js
└── package.json
```

## Conventions

- Functional components with hooks only.
- One component per file (PascalCase).
- Semantic HTML (`<main>`, `<nav>`, `<section>`).
- Unique `id` on all interactive elements.
- Colocate CSS next to pages.

## main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a24', color: '#f4f4f8', border: '1px solid rgba(255,255,255,0.06)' }
        }} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

## Environment

```env
VITE_API_URL=http://localhost:5000/api
```

## Dependencies

react, react-dom, react-router-dom, axios, react-icons, react-hot-toast  
**Dev:** vite, @vitejs/plugin-react

## Setup

```bash
cd frontend && npm install && npm run dev
```
