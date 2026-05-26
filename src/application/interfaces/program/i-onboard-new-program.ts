import { ProgramPictureFileDTO, OnboardProgramBodyDTO } from "application/dto/management/programs-management/onboard-new-program.dto";
export const I_ONBOARD_NEW_PROGRAM_TOKEN = Symbol("I_ONBOARD_NEW_PROGRAM_TOKEN");
export interface IOnboardNewProgram {
    execute(bodyDData: OnboardProgramBodyDTO, fileData: ProgramPictureFileDTO): Promise<void>;
}