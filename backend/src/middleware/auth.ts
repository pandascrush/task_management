import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';
import { AuthRequest } from '../types';
import { RESP_MESSAGES } from '../constants/messages';

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, RESP_MESSAGES.AUTH.UNAUTHORIZED);
    }

    const token = header.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = { identity: decoded.identity, role: decoded.role };
    next();
  } catch (error) {
    next(new ApiError(401, RESP_MESSAGES.AUTH.TOKEN_EXPIRED));
  }
};
