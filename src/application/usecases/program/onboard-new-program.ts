import { injectable, inject } from "tsyringe";
import { randomUUID } from "crypto";
import { ProgramEntity } from "domain/entities/ProgramEntity";
import { I_PROGRAM_REPO_TOKEN, IProgramRepo } from "domain/repositories/IProgramRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { OnboardProgramRequestDTO } from "application/dto/programs/onboard-new-program.dto";
import { IOnboardNewProgram } from "application/interfaces/program/i-onboard-new-program";

@injectable()
export class OnboardNewProgram implements IOnboardNewProgram {
  constructor(
    @inject(I_PROGRAM_REPO_TOKEN) private readonly _programRepo: IProgramRepo,
    @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly _cloudinaryService: ICloudinaryService
  ) {}

  async execute(input: OnboardProgramRequestDTO): Promise<void> {
    let programPicUrl = "";

    if (input.programPic) {
      const safeName = input.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
      programPicUrl = await this._cloudinaryService.getProgramImageUrl(
        input.programPic,
        safeName
      );
    }

    const programPayload = new ProgramEntity(
      randomUUID(),    
      input.name,           
      input.description,        
      programPicUrl,
      true            
    );

    await this._programRepo.saveProgram(programPayload);
  }
}