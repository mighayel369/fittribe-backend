import { ProgramDetailsResponseDTO } from "application/dto/management/programs-management/program-details.dto";
export const I_FETCH_PROGRAM_DETAILS_TOKEN = Symbol("I_FETCH_PROGRAM_DETAILS_TOKEN");
export interface IFetchProgramDetails {
    execute(programId: string): Promise<ProgramDetailsResponseDTO>;
}