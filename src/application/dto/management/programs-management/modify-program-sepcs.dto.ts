import z from 'zod'
export const ModifyProgramBodySchema =
  z.object({
    programId: z.string().trim().min(
      1,
      "Program ID is required"
    ),

    name: z.string().trim().min(
      3,
      "Program name must be at least 3 characters"
    ).max(
      50,
      "Program name is too long"
    ),

    description: z.string().trim().min(
      10,
      "Program description must be at least 10 characters"
    ).max(
      1000,
      "Program description is too long"
    )
  });

export type ModifyProgramBodyDTO = z.infer<typeof ModifyProgramBodySchema>;