import { inject, injectable } from "tsyringe";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IToggleProgramVisibility } from "application/interfaces/program/i-toggle-program-visibility";
import { 
  ToggleProgramVisibilityRequestDTO, 
  ToggleProgramVisibilityResponseDTO 
} from "application/dto/programs/toggle-program-visibility.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { ProgramMapper } from "application/mappers/program-mapper";

@injectable()
export class ToggleProgramVisibilityUseCase implements IToggleProgramVisibility {
  constructor(
    @inject(I_PROGRAM_REPO_TOKEN) private readonly _programRepo: IProgramRepo
  ) {}

  async execute(input: ToggleProgramVisibilityRequestDTO): Promise<ToggleProgramVisibilityResponseDTO> {
    const { programId, isPublished } = input;
    
    const program = await this._programRepo.updateProgramVisibility(programId, isPublished);
    
    if (!program) {
        throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return ProgramMapper.toVisibilityResponseDTO(program);
  }
}