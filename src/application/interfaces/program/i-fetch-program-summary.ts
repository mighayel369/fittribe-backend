import { FetchProgramsQueryDTO } from "application/dto/management/programs-management/fetch-all-programs.request.dto";
import { FetchProgramInventoryResponseDTO } from "application/dto/management/programs-management/program-summary.dto";
export const I_FETCH_PROGRAM_INVENTORY_TOKEN = Symbol("I_FETCH_PROGRAM_INVENTORY_TOKEN");

export interface IFetchProgramInventory {
    execute(input: FetchProgramsQueryDTO): Promise<FetchProgramInventoryResponseDTO>;
}