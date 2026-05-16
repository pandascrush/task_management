import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/jwt';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken({ identity: user.identity, role: user.role });

    logger.info(`TRIGGER: User logged in - ${user.email}`);

    return {
      user: {
        identity: user.identity,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
