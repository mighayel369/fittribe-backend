import { OnboardProgramRequestDTO } from "application/dto/programs/onboard-new-program.dto";
export const I_ONBOARD_NEW_PROGRAM_TOKEN = Symbol("I_ONBOARD_NEW_PROGRAM_TOKEN");
export interface IOnboardNewProgram {
    execute(input: OnboardProgramRequestDTO): Promise<void>;
}