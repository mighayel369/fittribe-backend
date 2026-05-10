import { injectable, inject } from "tsyringe";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { IModifyProgramSpecs } from "application/interfaces/program/i-modify-program-specs";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { ModifyProgramSpecsRequestDTO } from "application/dto/programs/modify-program-sepcs.dto";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class ModifyProgramSpecs implements IModifyProgramSpecs {
  constructor(
    @inject(I_PROGRAM_REPO_TOKEN)
    private readonly _programRepository: IProgramRepo,

    @inject(I_CLOUDINARY_SERVICE_TOKEN)
    private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(updatePayload: ModifyProgramSpecsRequestDTO): Promise<void> {
    const { programId, file, name, description } = updatePayload;

    const existingProgram = await this._programRepository.findProgramById(programId);
    if (!existingProgram) {
      throw new AppError(ERROR_MESSAGES.PROGRAM_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    let newPicUrl = existingProgram.programPic;
    if (file) {
      const safeName = (name || existingProgram.name).toLowerCase().replace(/[^a-z0-9]/g, "-");
      newPicUrl = await this._cloudinaryService.getProgramImageUrl(file, safeName);
    }

    try {
      existingProgram.updateSpecifications(name, description, newPicUrl);

      const isUpdated = await this._programRepository.updateProgramSpecs(existingProgram);
      if (!isUpdated) {
        throw new AppError(ERROR_MESSAGES.PROGRAM_UPDATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (domainError: unknown) {
      const message = domainError instanceof Error ? domainError.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
      throw new AppError(message, HttpStatus.BAD_REQUEST);
    }
  }
}