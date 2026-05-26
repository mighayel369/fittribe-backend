import z from "zod"


export const trainerIdParamSchema = z.object({
    trainerId: z.string()
})

export type trainerIdParamDto=z.infer<typeof trainerIdParamSchema>