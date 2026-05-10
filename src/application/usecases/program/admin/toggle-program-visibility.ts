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
    @inject(I_PROGRAM_REPO_TOKEN)
    private readonly _programRepository: IProgramRepo
  ) { }

  async execute(visibilityPayload: ToggleProgramVisibilityRequestDTO): Promise<ToggleProgramVisibilityResponseDTO> {
    const { programId, isPublished } = visibilityPayload;

    const updatedProgram = await this._programRepository.updateProgramVisibility(programId, isPublished);

    if (!updatedProgram) {
      throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return ProgramMapper.toVisibilityResponseDTO(updatedProgram);
  }
}