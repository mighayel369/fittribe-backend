import { ProgramDetailsResponseDTO } from "application/dto/programs/program-details.dto";
export const I_FETCH_PROGRAM_DETAILS_TOKEN = Symbol("I_FETCH_PROGRAM_DETAILS_TOKEN");
export interface IFetchProgramDetails{
    execute(programId: string): Promise<ProgramDetailsResponseDTO>;
}