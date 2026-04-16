import { ExploreProgramsResponseDTO } from "application/dto/programs/program-summary.dto";

export const I_EXPLORE_PROGRAMS_TOKEN = Symbol("I_EXPLORE_PROGRAMS_TOKEN");
export interface IExplorePrograms{
    execute():Promise<ExploreProgramsResponseDTO>
}