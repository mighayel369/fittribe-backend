import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.email(),
  password: z.string("Password is required").min(1, "Password cannot be empty"),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;


