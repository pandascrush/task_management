import bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';
import prisma from '../config/prisma';
import ApiError from '../utils/ApiError';
import { getPaginationData, formatPaginatedResponse } from '../utils/pagination';
import { RESP_MESSAGES } from '../constants/messages';

export class UserService {
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'USER';
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ApiError(409, RESP_MESSAGES.USER.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        identity: uuidv7(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
      },
      select: {
        identity: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  static async getAllUsers(page: number = 1, limit: number = 10, excludeAdmins: boolean = false) {
    const { skip, take } = getPaginationData(page, limit);
    const where = excludeAdmins ? { role: 'USER' as const } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          identity: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return formatPaginatedResponse(users, total, page, limit);
  }
}
