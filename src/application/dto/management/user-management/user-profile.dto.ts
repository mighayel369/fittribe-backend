import { z } from "zod";
import { GENDER } from "domain/constants/gender";
import { UserResponseSchema } from "application/dto/management/user-management/all-users.dto";

export const AdminUserDetailSchema =
  UserResponseSchema.extend({
    role: z.string(),
    createdAt: z.coerce.date(),
    gender: z.enum(GENDER).optional(),
    age: z.number().int()
      .positive()
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    profilePic: z.string().optional()
  });

export type AdminUserDetailDTO = z.infer<typeof AdminUserDetailSchema>;
