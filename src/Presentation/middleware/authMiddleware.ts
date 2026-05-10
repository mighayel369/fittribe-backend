import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { UserRole } from 'domain/constants/user-role';
import logger from 'utils/logger';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: ERROR_MESSAGES.UNAUTHORIZED });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string; email: string; role: UserRole };

      if (!allowedRoles.includes(decoded.role)) {
        res.status(HttpStatus.FORBIDDEN).json({ message: ERROR_MESSAGES.ACCESS_DENIED });
        return;
      }

      req.user = {
        accessToken: token,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        }
      };

      next();
    } catch (err) {
      logger.warn("Token verification failed:", err instanceof Error ? err.message : "Unknown");
      res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
    }
  };
};