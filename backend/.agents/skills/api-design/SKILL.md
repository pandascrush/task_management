---
name: api-design
description: >
  REST API design and endpoint specifications for the Task Management System backend.
  Use when creating new endpoints, designing request/response contracts, adding
  validation, or following the standardized response format. All code is TypeScript.
---

# API Design — Backend (TypeScript)

## Base URL: `/api`

## Standardized Response Format

All endpoints must return a consistent JSON shape using **`status`** (not `success`):

```ts
// Success
{ "status": true, "message": "...", "data": { ... } }

// Error
{ "status": false, "message": "..." }
```

Use the `ApiResponse` helper — `src/utils/ApiResponse.ts`:
```ts
class ApiResponse {
  status: boolean;
  message: string;
  data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    this.status = statusCode < 400;
    this.message = message;
    if (data) this.data = data;
  }
}

export default ApiResponse;
```

---

## Auth Endpoints

| Method | Endpoint          | Access | Body                          | Description     |
|--------|-------------------|--------|-------------------------------|-----------------|
| POST   | `/api/auth/login` | Public | `{ email, password }`         | Login → JWT     |

**Response 200:**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": "...", "name": "Admin", "email": "admin@example.com", "role": "ADMIN" }
  }
}
```

## User Endpoints (Admin Only)

| Method | Endpoint     | Access | Body                                     | Description |
|--------|--------------|--------|------------------------------------------|-------------|
| POST   | `/api/users` | Admin  | `{ name, email, password, role }`        | Create user |
| GET    | `/api/users` | Admin  | —                                        | List users  |

**POST /api/users — Response 201:**
```json
{
  "status": true,
  "message": "User created successfully",
  "data": { "id": "...", "name": "John", "email": "john@example.com", "role": "USER" }
}
```

## Task Endpoints

| Method | Endpoint                 | Access       | Body                                             | Description        |
|--------|--------------------------|--------------|--------------------------------------------------|--------------------|
| POST   | `/api/tasks`             | Admin        | `{ title, description?, assigneeId? }`           | Create task        |
| PATCH  | `/api/tasks/:id/assign`  | Admin        | `{ assigneeId }`                                 | Assign to user     |
| GET    | `/api/tasks`             | Admin / User | —                                                | Get tasks          |
| PATCH  | `/api/tasks/:id/status`  | Auth         | `{ status: "PENDING\|IN_PROGRESS\|COMPLETED" }`  | Update status      |

**GET /api/tasks — Role-aware:**
- **Admin** → returns ALL tasks with assignee details.
- **User** → returns only tasks where `assigneeId === req.user.userId`.

**POST /api/tasks — Response 201:**
```json
{
  "status": true,
  "message": "Task created successfully",
  "data": {
    "id": "...", "title": "Fix bug", "status": "PENDING",
    "assignee": { "id": "...", "name": "John" }
  }
}
```

---

## Validation — `src/validators/`

Use Zod schemas. Validators live in `src/validators/` (NOT inside modules):

```ts
// src/validators/auth.validator.ts
import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

// src/validators/user.validator.ts
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'USER']).optional(),
  }),
});

// src/validators/task.validator.ts
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    assigneeId: z.string().uuid().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  }),
});

export const assignTaskSchema = z.object({
  body: z.object({
    assigneeId: z.string().uuid(),
  }),
});
```

## Validate Middleware — `src/middleware/validate.ts`

```ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, params: req.params, query: req.query });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      });
    }
    next(error);
  }
};

export default validate;
```

## Route File Pattern — `src/routes/task.routes.ts`

```ts
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { role } from '../middleware/role';
import validate from '../middleware/validate';
import * as taskController from '../controllers/task.controller';
import { createTaskSchema, updateStatusSchema, assignTaskSchema } from '../validators/task.validator';

const router = Router();

router.post('/', auth, role('ADMIN'), validate(createTaskSchema), taskController.create);
router.get('/', auth, taskController.getAll);
router.patch('/:id/assign', auth, role('ADMIN'), validate(assignTaskSchema), taskController.assign);
router.patch('/:id/status', auth, validate(updateStatusSchema), taskController.updateStatus);

export default router;
```

## HTTP Status Codes Used

| Code | Meaning           | When                              |
|------|-------------------|-----------------------------------|
| 200  | OK                | Successful GET, PATCH             |
| 201  | Created           | Successful POST (create)          |
| 400  | Bad Request       | Validation failure                |
| 401  | Unauthorized      | Missing/invalid token             |
| 403  | Forbidden         | Insufficient role                 |
| 404  | Not Found         | Resource doesn't exist            |
| 409  | Conflict          | Duplicate email                   |
| 500  | Server Error      | Unexpected error                  |
