import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../types';
import ApiResponse from '../utils/ApiResponse';
import { RESP_MESSAGES } from '../constants/messages';

export class TaskController {
  static create = catchAsync(async (req: AuthRequest, res: Response) => {
    const task = await TaskService.createTask(req.body);
    return res.status(201).json(
      new ApiResponse(201, RESP_MESSAGES.TASK.CREATED, task)
    );
  });

  static getAll = catchAsync(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    let result;
    if (req.user?.role === 'ADMIN') {
      result = await TaskService.getAllTasks(page, limit);
    } else {
      result = await TaskService.getTasksByUser(req.user!.identity, page, limit);
    }

    return res.status(200).json({
      status: true,
      message: RESP_MESSAGES.TASK.FETCHED,
      data: result.data,
      pagination: result.pagination
    });
  });

  static assign = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { assigneeId } = req.body;
    const task = await TaskService.assignTask(id as string, assigneeId);
    return res.status(200).json(
      new ApiResponse(200, RESP_MESSAGES.TASK.ASSIGNED, task)
    );
  });

  static updateStatus = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const task = await TaskService.updateTaskStatus(
      id as string,
      status,
      req.user!.identity,
      req.user!.role
    );
    return res.status(200).json(
      new ApiResponse(200, RESP_MESSAGES.TASK.STATUS_UPDATED, task)
    );
  });
}
