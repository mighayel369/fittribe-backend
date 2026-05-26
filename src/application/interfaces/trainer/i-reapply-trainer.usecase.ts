import { CertificatePictureFile } from "application/dto/auth/trainer/certificate-file.schema";
import { ReapplyTrainerDTO } from "application/dto/auth/trainer/reapply-trainer.dto";

export const I_REAPPLY_TRAINER_TOKEN = Symbol("I_REAPPLY_TRAINER_TOKEN");

export interface IReapplyTrainer {

  execute(trainerId: string,data: ReapplyTrainerDTO,certificate?: CertificatePictureFile): Promise<void>
}