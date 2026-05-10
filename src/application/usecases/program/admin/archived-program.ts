import { inject, injectable } from "tsyringe";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { IArchiveProgram } from "application/interfaces/program/i-archive-program";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";

@injectable()
export class ArchiveProgram implements IArchiveProgram {
  constructor(
    @inject(I_PROGRAM_REPO_TOKEN)
    private readonly _programRepository: IProgramRepo
  ) { }

  async execute(programId: string): Promise<void> {
    const existingProgram = await this._programRepository.findProgramById(programId);

    if (!existingProgram) {
      throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._programRepository.archiveProgram(programId);

  }
}