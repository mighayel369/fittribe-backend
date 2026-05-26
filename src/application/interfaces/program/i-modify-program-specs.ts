import { ModifyProgramBodyDTO } from "application/dto/management/programs-management/modify-program-sepcs.dto";
import {  ProgramPictureFileDTO } from "application/dto/management/programs-management/onboard-new-program.dto";
export const I_MODIFY_PROGRAM_SPECS_TOKEN = Symbol("I_MODIFY_PROGRAM_SPECS_TOKEN");
export interface IModifyProgramSpecs {
    execute(bodyDData: ModifyProgramBodyDTO, fileData?: ProgramPictureFileDTO): Promise<void>;
}