import { 
    FetchProgramInventoryRequestDTO, 
    FetchProgramInventoryResponseDTO 
} from "application/dto/programs/program-summary.dto";
export const I_FETCH_PROGRAM_INVENTORY_TOKEN = Symbol("I_FETCH_PROGRAM_INVENTORY_TOKEN");
export interface IFetchProgramInventory{
    execute(input: FetchProgramInventoryRequestDTO): Promise<FetchProgramInventoryResponseDTO>;
}