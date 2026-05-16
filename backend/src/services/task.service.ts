import { uuidv7 } from 'uuidv7';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import { TaskStatusType } from '../types';
import { getPaginationData, formatPaginatedResponse } from '../utils/pagination';
import { RESP_MESSAGES } from '../constants/messages';
import logger from '../config/logger';

const taskInclude = {
  assignee: {
    select: { identity: true, name: true, email: true },
  },
};

export class TaskService {
  static async createTask(data: {
    title: string;
    description?: string;
    assigneeId?: string;
  }) {
    if (data.assigneeId) {
      const user = await prisma.user.findUnique({ where: { identity: data.assigneeId } });
      if (!user) throw new ApiError(404, RESP_MESSAGES.USER.NOT_FOUND);
    }

    const task = await prisma.task.create({
      data: {
        identity: uuidv7(),
        title: data.title,
        description: data.description,
        assigneeId: data.assigneeId,
      },
      include: taskInclude,
    });

    logger.info(`TRIGGER: Task Created - ${task.title} (ID: ${task.identity})`);

    return task;
  }

  static async getAllTasks(page: number = 1, limit: number = 10) {
    const { skip, take } = getPaginationData(page, limit);

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take,
        include: taskInclude,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count(),
    ]);

    return formatPaginatedResponse(tasks, total, page, limit);
  }

  static async getTasksByUser(userIdentity: string, page: number = 1, limit: number = 10) {
    const { skip, take } = getPaginationData(page, limit);
    const where = { assigneeId: userIdentity };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        include: taskInclude,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    return formatPaginatedResponse(tasks, total, page, limit);
  }

  static async assignTask(taskIdentity: string, assigneeIdentity: string) {
    const task = await prisma.task.findUnique({ where: { identity: taskIdentity } });
    if (!task) throw new ApiError(404, RESP_MESSAGES.TASK.NOT_FOUND);

    const user = await prisma.user.findUnique({ where: { identity: assigneeIdentity } });
    if (!user) throw new ApiError(404, RESP_MESSAGES.USER.NOT_FOUND);

    const updatedTask = await prisma.task.update({
      where: { identity: taskIdentity },
      data: { assigneeId: assigneeIdentity },
      include: taskInclude,
    });

    logger.info(`TRIGGER: Task Assigned - Task: ${taskIdentity} -> User: ${assigneeIdentity}`);

    return updatedTask;
  }

  static async updateTaskStatus(
    taskIdentity: string,
    status: TaskStatusType,
    userIdentity: string,
    userRole: string
  ) {
    const task = await prisma.task.findUnique({ where: { identity: taskIdentity } });
    if (!task) throw new ApiError(404, RESP_MESSAGES.TASK.NOT_FOUND);

    if (userRole === 'USER' && task.assigneeId !== userIdentity) {
      throw new ApiError(403, RESP_MESSAGES.TASK.UNAUTHORIZED);
    }

    const updatedTask = await prisma.task.update({
      where: { identity: taskIdentity },
      data: { status },
      include: taskInclude,
    });

    logger.info(`TRIGGER: Status Updated - Task: ${taskIdentity} -> ${status} by ${userIdentity}`);

    return updatedTask;
  }
}
