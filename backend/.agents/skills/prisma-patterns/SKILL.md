---
name: prisma-patterns
description: >
  Prisma ORM patterns for the Task Management System backend. Use when writing
  database queries, setting up the PrismaClient singleton, running migrations,
  seeding data, or working with Prisma-specific features. TypeScript.
---

# Prisma Patterns — Backend (TypeScript)

## PrismaClient Singleton — `src/prisma.ts`

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

Import this singleton everywhere — never instantiate PrismaClient more than once.

## Common Query Patterns

### Find with relation include
```ts
const tasks = await prisma.task.findMany({
  include: { assignee: { select: { id: true, name: true, email: true } } },
  orderBy: { createdAt: 'desc' },
});
```

### Exclude fields (e.g., password)
```ts
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true, role: true, createdAt: true },
});
```

### Filtered queries (role-aware)
```ts
// User sees only their tasks
const tasks = await prisma.task.findMany({
  where: { assigneeId: userId },
  include: { assignee: { select: { id: true, name: true } } },
});
```

### Upsert (idempotent seed)
```ts
await prisma.user.upsert({
  where: { email: 'admin@admin.com' },
  update: {},
  create: { name: 'Admin', email: 'admin@admin.com', password: hashed, role: 'ADMIN' },
});
```

### Update specific fields
```ts
await prisma.task.update({
  where: { id: taskId },
  data: { status: 'IN_PROGRESS' },
});

await prisma.task.update({
  where: { id: taskId },
  data: { assigneeId: userId },
});
```

## Database Seeding — `prisma/seed.ts`

```ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seed completed: default admin created');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:
```json
{ "prisma": { "seed": "ts-node prisma/seed.ts" } }
```

## Migration Commands

```bash
npx prisma migrate dev --name init    # Create & apply migration
npx prisma generate                    # Generate client after schema changes
npx prisma db seed                     # Run seed
npx prisma studio                      # Open Prisma Studio (GUI)
```

## Dependencies

@prisma/client (production), prisma (dev), ts-node (dev)
