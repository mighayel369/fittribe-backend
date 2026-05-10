import { injectable, inject } from "tsyringe";
import { ITrainerRepo, I_TRAINER_REPO_TOKEN } from "domain/repositories/ITrainerRepo";
import { IMailService, I_EMAIL_SERVICE_TOKEN } from "domain/services/i-mail-service";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerApprovalRequestDTO } from "application/dto/trainer/trainer-approval.dto";
import { IHandleTrainerApproval } from "application/interfaces/trainer/i-handle-trainer-approval.usecase";
import { ACTIONS, APPROVAL_MESSAGES } from "utils/Constants";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { getTrainerStatusTemplate } from "../templates/email-templates";
import { TRAINER_STATUS } from "domain/constants/trainer-status";
@injectable()
export class HandleTrainerApproval implements IHandleTrainerApproval {
  constructor(
    @inject(I_TRAINER_REPO_TOKEN) private readonly _trainerRepository: ITrainerRepo,
    @inject(I_EMAIL_SERVICE_TOKEN) private readonly _mailService: IMailService
  ) { }

  async execute(approvalData: TrainerApprovalRequestDTO): Promise<void> {
    const { trainerId, action, reason } = approvalData;
    const verificationStatus = action === ACTIONS.ACCEPT ? TRAINER_STATUS.ACCEPTED : TRAINER_STATUS.REJECTED;

    await this._trainerRepository.updateVerificationStatus(trainerId, verificationStatus, reason);
    const trainer = await this._trainerRepository.findTrainerById(trainerId)
    if (!trainer) {
      throw new AppError(ERROR_MESSAGES.TRAINER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const isAccepted = action === ACTIONS.ACCEPT;
    const subject = isAccepted ? 'Trainer Verification Approved' : 'Trainer Verification Declined';

    const message = isAccepted
      ? APPROVAL_MESSAGES.SUCCESS_BODY(trainer.name)
      : APPROVAL_MESSAGES.REJECT_BODY(trainer.name, reason||"N/A");

    const htmlContent = getTrainerStatusTemplate(subject, message);


    await this._mailService.sendHtmlEmail(trainer.email, subject, htmlContent);
  }
}