import z from 'zod'

export const RegisterResponseSchema=z.object({
    email:z.email()
})

export type RegisterResponseDTO=z.infer<typeof RegisterResponseSchema>
