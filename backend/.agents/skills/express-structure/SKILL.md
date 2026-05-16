---
name: express-structure
description: >
  Backend project structure and Express.js app setup for the Task Management System.
  Use when scaffolding the backend, configuring middleware, setting up the server entry
  point, or organizing folders. Covers TypeScript + Node.js + Express conventions.
  Folder structure matches the Placement BE pattern.
---

# Express Structure — Backend (TypeScript)

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Module system:** ES Modules (`import / export`)

## Project Layout

```
backend/
├── .agents/
│   └── skills/               # Agent skills (this folder)
├── prisma/
│   ├── schema.prisma         # Prisma schema (see data-models skill)
│   ├── seed.ts               # Database seeder
│   └── migrations/           # Auto-generated migrations
├── src/
│   ├── config/
│   │   └── index.ts          # Centralised env config
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── task.controller.ts
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   ├── role.ts           # Role gating
│   │   ├── validate.ts       # Zod request validation
│   │   └── errorHandler.ts   # Global error handler
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── task.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── task.service.ts
│   ├── types/
│   │   └── index.ts          # Shared interfaces & types
│   ├── utils/
│   │   ├── ApiError.ts       # Custom error class
│   │   ├── ApiResponse.ts    # Standard response wrapper (uses "status")
│   │   ├── catchAsync.ts     # Async error catcher
│   │   └── jwt.ts            # Token generation & verification
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   └── task.validator.ts
│   ├── prisma.ts             # PrismaClient singleton
│   ├── app.ts                # Express app (middleware + route mounting)
│   └── server.ts             # Entry point — starts the server
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Types — `src/types/index.ts`

```ts
import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
```

## app.ts

```ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
```

## server.ts

```ts
import 'dotenv/config';
import app from './app';
import config from './config';

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

## config/index.ts

```ts
const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
```

## Error Handling

```ts
// utils/ApiError.ts
class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
export default ApiError;

// utils/catchAsync.ts
import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default catchAsync;

// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  res.status(statusCode).json({
    status: false,
    message: err.message || 'Internal Server Error',
  });
};
```

## NPM Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:studio": "npx prisma studio",
    "db:generate": "npx prisma generate"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Dependencies

**Production:** express, @prisma/client, bcrypt, jsonwebtoken, cors, helmet, dotenv, morgan, zod  
**Dev:** prisma, typescript, ts-node-dev, @types/express, @types/bcrypt, @types/jsonwebtoken, @types/cors, @types/morgan

## Setup

```bash
cd backend
npm install
cp .env.example .env   # configure DB credentials
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run dev
```
