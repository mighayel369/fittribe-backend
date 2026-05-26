import z from 'zod'

export const ForgotPasswordSchema = z.object({
    email: z.email({ message: "Invalid email format" })
});


export type ForgotPasswordRequestDTO = z.infer<typeof ForgotPasswordSchema>;