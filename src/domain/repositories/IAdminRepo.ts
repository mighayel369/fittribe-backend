import { AdminEntity } from "domain/entities/AdminEntity";

export const I_ADMIN_REPO_TOKEN = Symbol("I_ADMIN_REPO_TOKEN");

export interface IAdminRepo {
    findAdminByEmail(email: string): Promise<AdminEntity | null>;
}