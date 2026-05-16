---
name: auth-and-roles
description: >
  JWT authentication and role-based access control for the Task Management System backend.
  Use when implementing login, token generation/verification, auth middleware, role guards,
  or password hashing. TypeScript. Uses bcrypt and jsonwebtoken.
---

# Auth & Roles — Backend (TypeScript)

## Roles

| Role  | Capabilities                                              |
|-------|-----------------------------------------------------------|
| ADMIN | Login, create users, create tasks, assign tasks, view all |
| USER  | Login, view own tasks, update task status                  |

## JWT Flow

1. `POST /api/auth/login` → validate email + password → generate JWT.
2. JWT payload: `{ userId: string, role: 'ADMIN' | 'USER' }`.
3. Token returned in response body → frontend stores in localStorage.
4. Frontend sends `Authorization: Bearer <token>` on all protected requests.
5. `auth` middleware verifies → attaches `req.user = { userId, role }`.
6. `role('ADMIN')` middleware gates admin-only endpoints.

## Password Handling

- Hash with **bcrypt**, salt rounds: **10**.
- Never return `password` in any response — use Prisma `select` to exclude.

```ts
import bcrypt from 'bcrypt';

// Hashing
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// Comparing
const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
```

## Token Helpers — `src/utils/jwt.ts`

```ts
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthPayload } from '../types';

export const generateToken = (payload: AuthPayload): string =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const verifyToken = (token: string): AuthPayload =>
  jwt.verify(token, config.jwtSecret) as AuthPayload;
```

## Auth Middleware — `src/middleware/auth.ts`

```ts
import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../types';

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      throw new ApiError(401, 'Authentication required');

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
```

## Role Middleware — `src/middleware/role.ts`

```ts
import { Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../types';

export const role = (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role))
      throw new ApiError(403, 'Access denied');
    next();
  };
```

## Route Usage

```ts
// src/routes/user.routes.ts
import { Router } from 'express';
import { auth } from '../middleware/auth';
import { role } from '../middleware/role';
import validate from '../middleware/validate';
import * as userController from '../controllers/user.controller';
import { createUserSchema } from '../validators/user.validator';

const router = Router();

// Admin only
router.post('/', auth, role('ADMIN'), validate(createUserSchema), userController.create);
router.get('/', auth, role('ADMIN'), userController.getAll);

export default router;
```

## Login Service — `src/services/auth.service.ts`

```ts
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { generateToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const token = generateToken({ userId: user.id, role: user.role });
  const { password: _, ...userData } = user;
  return { token, user: userData };
};
```

## Login Controller — `src/controllers/auth.controller.ts`

```ts
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as authService from '../services/auth.service';

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await authService.login(email, password);
  res.status(200).json({ status: true, message: 'Login successful', data });
});
```

## Dependencies

bcrypt, jsonwebtoken, @types/bcrypt, @types/jsonwebtoken
