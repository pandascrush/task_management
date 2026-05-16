import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { UserService } from '../services/user.service';
import ApiResponse from '../utils/ApiResponse';
import { RESP_MESSAGES } from '../constants/messages';

export class UserController {
  static create = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);
    return res.status(201).json(
      new ApiResponse(201, RESP_MESSAGES.USER.CREATED, user)
    );
  });

  static getAll = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const excludeAdmins = req.query.excludeAdmins === 'true';

    const result = await UserService.getAllUsers(page, limit, excludeAdmins);
    
    return res.status(200).json({
      status: true,
      message: RESP_MESSAGES.USER.FETCHED,
      data: result.data,
      pagination: result.pagination
    });
  });
}
