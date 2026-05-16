---
name: routing-and-auth
description: >
  React Router configuration, protected routes, and auth context for the Task
  Management System frontend. Use when setting up routing, creating auth guards,
  managing login/logout state, or implementing role-based navigation.
---

# Routing & Auth — Frontend

## Route Map

| Path         | Component        | Access       | Description         |
|--------------|------------------|--------------|---------------------|
| `/login`     | LoginPage        | Public       | Login form          |
| `/admin`     | AdminDashboard   | ADMIN only   | Admin dashboard     |
| `/dashboard` | UserDashboard    | USER only    | User task view      |
| `/`          | —                | Redirect     | → `/login`          |
| `*`          | —                | Redirect     | → `/login`          |

## App.jsx

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<UserDashboard />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
export default App;
```

## ProtectedRoute

```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from './common/Loader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/login" replace />;
  return <Outlet />;
};
export default ProtectedRoute;
```

## AuthContext

```jsx
import { createContext, useState, useEffect } from 'react';
import { loginAPI } from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch { logout(); }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    const { token: newToken, user: userData } = res.data.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## useAuth Hook

```jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

## Login Flow

1. Submit email + password → `login()` calls API.
2. API returns `{ status: true, data: { token, user } }`.
3. Store token in localStorage, set user state.
4. Redirect: ADMIN → `/admin`, USER → `/dashboard`.

## Logout Flow

1. `logout()` → clear localStorage → clear state → redirect `/login`.
