import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthPayload } from '../types';

const SECRET = config.jwtSecret || 'secret';
const EXPIRES_IN = config.jwtExpiresIn || '7d';

export const generateToken = (payload: AuthPayload): string =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN as any });

export const verifyToken = (token: string): AuthPayload =>
  jwt.verify(token, SECRET) as AuthPayload;
