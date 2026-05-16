import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    assigneeId: z.string().uuid('Invalid user ID').optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  }),
});

export const assignTaskSchema = z.object({
  body: z.object({
    assigneeId: z.string().uuid('Invalid user ID'),
  }),
});
