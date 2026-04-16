import { ModifyProgramSpecsRequestDTO } from "application/dto/programs/modify-program-sepcs.dto";
export const I_MODIFY_PROGRAM_SPECS_TOKEN = Symbol("I_MODIFY_PROGRAM_SPECS_TOKEN");
export interface IModifyProgramSpecs{
    execute(input: ModifyProgramSpecsRequestDTO): Promise<void>;
}