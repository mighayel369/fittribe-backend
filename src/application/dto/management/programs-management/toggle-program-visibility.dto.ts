
import { z } from "zod";

export const ToggleProgramVisibilityRequestSchema =
  z.object({
    programId: z.string().trim().min(1, "Program ID is required"),
    status: z.boolean({ message: "Program visibility status must be boolean" })
  });

export type ToggleProgramVisibilityBodyDTO = z.infer<typeof ToggleProgramVisibilityRequestSchema>;

export interface ToggleProgramVisibilityRequestDTO {
  programId: string;
  isPublished: boolean;
}

export const ToggleProgramVisibilityResponseSchema =
  z.object({
    isPublished: z.boolean()
  });

export type ToggleProgramVisibilityResponseDTO = z.infer<typeof ToggleProgramVisibilityResponseSchema>;