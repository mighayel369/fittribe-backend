
import { UserRole } from "../../utils/Constants"; 


export {};

declare global {
  namespace Express {
    interface AuthenticatedUser {
      id: string;
      email: string;
      role: UserRole;
      name?: string;
    }

    interface User {
      accessToken: string;
      user: AuthenticatedUser;
    }
  }
}