import { UserRole } from 'domain/constants/user-role';
import { Request } from 'express';


interface PassportUser {
    accessToken: string;
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
}

export interface AuthRequest extends Request {
    user?: PassportUser;
}