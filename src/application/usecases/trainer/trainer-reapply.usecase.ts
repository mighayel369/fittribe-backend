import { inject, injectable } from "tsyringe";
import { I_TRAINER_REPO_TOKEN, ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { I_CLOUDINARY_SERVICE_TOKEN, ICloudinaryService } from "domain/services/ICloudinaryService";
import { TrainerEntity } from "domain/entities/TrainerEntity";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { STATUS } from "utils/Constants"; // Ensure you import your STATUS enum
import { IReapplyTrainer } from "application/interfaces/trainer/i-reapply-trainer.usecase";
import { ReapplyTrainerRequestDTO } from "application/dto/trainer/update-trainer-profile.dto";
import { ProgramEntity } from "domain/entities/ProgramEntity";

@injectable()
export class ReapplyTrainerUseCase implements IReapplyTrainer {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly trainerRepo: ITrainerRepo,
    @inject(I_CLOUDINARY_SERVICE_TOKEN) private readonly cloudinaryService: ICloudinaryService
  ) {}

  async execute(input: ReapplyTrainerRequestDTO): Promise<void> {
    const { trainerId, data } = input;
    
    const existing = await this.trainerRepo.findTrainerById(trainerId);
    if (!existing) {
      throw new AppError("Trainer not found", HttpStatus.NOT_FOUND);
    }


    let certificateUrl = existing.certificate;
    if (data.certificate) {
      certificateUrl = await this.cloudinaryService.getTrainerCertificateUrl(
        data.certificate,
        existing.email
      );
    }


    const mappedPrograms: (ProgramEntity | string)[] = data.programs 
      ? data.programs.map(id => ({ programId: id } as ProgramEntity))
      : existing.programs;

    const updatedEntity = new TrainerEntity(
      trainerId,
      data.name || existing.name,
      existing.email,
      existing.role,
      STATUS.PENDING,
      data.pricePerSession ?? existing.pricePerSession,
      existing.password,
      data.languages ?? existing.languages,
      data.experience ?? existing.experience,
      mappedPrograms, 
      certificateUrl, 
      data.gender ?? existing.gender,
      existing.rating,
      existing.reviewCount, 
      existing.status,
      existing.createdAt,
      null, 
      existing.profilePic
    );

    await this.trainerRepo.updateTrainer(trainerId, updatedEntity);
  }
}