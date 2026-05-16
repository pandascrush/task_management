---
name: api-integration
description: >
  Axios HTTP client setup and API integration functions for the Task Management
  System frontend. Use when making API calls, configuring interceptors, handling
  auth tokens, or creating new API service functions.
---

# API Integration — Frontend

## Axios Instance — `api/axios.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

## API Functions

```js
// api/auth.api.js
import api from './axios';
export const loginAPI = (data) => api.post('/auth/login', data);

// api/user.api.js
import api from './axios';
export const createUserAPI = (data) => api.post('/users', data);
export const getUsersAPI = () => api.get('/users');

// api/task.api.js
import api from './axios';
export const createTaskAPI = (data) => api.post('/tasks', data);
export const getTasksAPI = () => api.get('/tasks');
export const assignTaskAPI = (id, data) => api.patch(`/tasks/${id}/assign`, data);
export const updateTaskStatusAPI = (id, data) => api.patch(`/tasks/${id}/status`, data);
```

## Usage Pattern

```jsx
import { getTasksAPI } from '../api/task.api';
import toast from 'react-hot-toast';

const fetchTasks = async () => {
  try {
    setLoading(true);
    const res = await getTasksAPI();
    if (res.data.status) setTasks(res.data.data);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to fetch tasks');
  } finally {
    setLoading(false);
  }
};
```

## Response Format (from backend)

```json
{ "status": true, "message": "...", "data": { ... } }
{ "status": false, "message": "..." }
```

Always check `res.data.status` — NOT `res.data.success`.

## Conventions

- Components never import axios directly — use API functions.
- Wrap calls in try/catch with toast notifications.
- Show loading state during API calls.

## Environment

```env
VITE_API_URL=http://localhost:5000/api
```
