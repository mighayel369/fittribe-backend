import { ToggleProgramVisibilityRequestDTO, ToggleProgramVisibilityResponseDTO } from "../../dto/management/programs-management/toggle-program-visibility.dto";
export const I_TOGGLE_PROGRAM_VISIBILITY_TOKEN = Symbol("I_TOGGLE_PROGRAM_VISIBILITY_TOKEN");

export interface IToggleProgramVisibility {
    execute(input: ToggleProgramVisibilityRequestDTO): Promise<ToggleProgramVisibilityResponseDTO>;
}