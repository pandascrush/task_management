---
name: data-models
description: >
  Prisma schema and data model definitions for the Task Management System.
  Use when creating or modifying database models, enums, relations, or the
  schema.prisma file. Covers User and Task models with Role and TaskStatus enums.
---

# Data Models — Prisma Schema

## Schema File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  USER
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  tasks     Task[]   @relation("AssignedTasks")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  assigneeId  String?
  assignee    User?      @relation("AssignedTasks", fields: [assigneeId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("tasks")
}
```

## Entity Relationship

```
User (1) ──── (0..*) Task
  │                    │
  ├─ id (UUID, PK)     ├─ id (UUID, PK)
  ├─ name              ├─ title
  ├─ email (unique)    ├─ description (nullable)
  ├─ password (hashed) ├─ status (enum)
  ├─ role (enum)       ├─ assigneeId (FK → User.id, nullable)
  ├─ createdAt         ├─ createdAt
  └─ updatedAt         └─ updatedAt
```

## Enums

### Role
| Value | Description                             |
|-------|-----------------------------------------|
| ADMIN | Full access — manage users and tasks    |
| USER  | Limited — view own tasks, update status |

### TaskStatus
| Value       | Description              |
|-------------|--------------------------|
| PENDING     | Task created, not started|
| IN_PROGRESS | Work is underway         |
| COMPLETED   | Task finished            |

## TypeScript Types — `src/types/index.ts`

```ts
import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type TaskStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type RoleType = 'ADMIN' | 'USER';
```

## Key Constraints

- `User.email` must be unique.
- `Task.assigneeId` is nullable — tasks can be unassigned.
- `Task.assignee` is an optional relation to `User`.
- Deleting a user does NOT cascade-delete tasks (default Prisma behavior).
- `@@map` maps models to snake_case table names (`users`, `tasks`).

## Environment Variable

```env
DATABASE_URL=postgresql://user:password@localhost:5432/task_management
```
