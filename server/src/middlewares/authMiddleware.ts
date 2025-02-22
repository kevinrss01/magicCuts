import type { Context } from 'hono';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
    
export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return c.json({ error: 'Token format invalid' }, 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};