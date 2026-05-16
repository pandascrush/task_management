import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json({
        status: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { identity: req.user.identity },
        select: {
          identity: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.status(200).json({
        status: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}
