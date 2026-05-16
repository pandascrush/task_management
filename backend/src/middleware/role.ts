import { Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../types';

export const role = (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Access denied');
    }
    next();
  };
