
import { injectable, inject } from "tsyringe";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { IOnboardNewProgram } from "application/interfaces/program/i-onboard-new-program";
import { OnboardProgramBodyDTO, ProgramPictureFileDTO } from "application/dto/management/programs-management/onboard-new-program.dto";
import { ProgramMapper } from "application/mappers/program-mapper";

@injectable()
export class OnboardNewProgram implements IOnboardNewProgram {

  constructor(
    @inject(I_PROGRAM_REPO_TOKEN) private readonly _programRepository: IProgramRepo,
    @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly _cloudinaryService: ICloudinaryService
  ) { }

  async execute(
    bodyData: OnboardProgramBodyDTO,
    fileData: ProgramPictureFileDTO
  ): Promise<void> {

    let programPicUrl = "";

    if (fileData) {
      const safeName = bodyData.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

      programPicUrl = await this._cloudinaryService.getProgramImageUrl(
        fileData,
        safeName
      );
    }

    const program = ProgramMapper.toEntity(bodyData, programPicUrl)

    await this._programRepository.saveProgram(program);
  }
}