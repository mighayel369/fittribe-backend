import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { I_UPDATE_STATUS_TOKEN, IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { I_HANDLE_TRAINER_APPROVAL_TOKEN, IHandleTrainerApproval } from 'application/interfaces/trainer/i-handle-trainer-approval.usecase';
import { I_FETCH_ALL_PENDING_TRAINERS_TOKEN, I_FETCH_ALL_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN, IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { TRAINER_STATUS } from 'domain/constants/trainer-status';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { FetchAllTrainersResponseDTO } from 'application/dto/management/trainer-management/all-trainers.dto';
import { FetchAllPendingTrainersResponseDTO } from 'application/dto/management/trainer-management/pending-trainers.dto';
import { FetchAllTrainersRequestDTO } from 'application/dto/discovery/fetch-all-trainer.request.dto';
import { AdminTrainerDetailsDTO } from 'application/dto/management/trainer-management/trainer-details.dto';
import { UpdateTrainerStatusRequestDTO } from 'application/dto/management/trainer-management/update-trainer-status.dto';
@injectable()
export class TrainerManagementController {
    constructor(
        @inject(I_UPDATE_STATUS_TOKEN)
        private readonly _updateStatusUseCase: IUpdateStatus<UpdateTrainerStatusRequestDTO>,

        @inject(I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN)
        private readonly _getTrainerDetailsUseCase: IFetchTrainerDetails<AdminTrainerDetailsDTO>,

        @inject(I_FETCH_ALL_TRAINERS_TOKEN)
        private readonly _fetchVerifiedTrainersUseCase: IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>,

        @inject(I_FETCH_ALL_PENDING_TRAINERS_TOKEN)
        private readonly _fetchPendingTrainersUseCase: IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>,

        @inject(I_HANDLE_TRAINER_APPROVAL_TOKEN)
        private readonly _handleApprovalUseCase: IHandleTrainerApproval,
    ) { }



    getVerifiedTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPage, limit, filter } = req.query as unknown as FetchAllTrainersRequestDTO
            const trainersResult = await this._fetchVerifiedTrainersUseCase.execute({
                currentPage,
                limit,
                filter: {
                    ...filter,
                    status: TRAINER_STATUS.ACCEPTED
                }
            });

            res.status(HttpStatus.OK).json({
                success: true,
                ...trainersResult
            });
        } catch (error) {
            next(error);
        }
    };

    getPendingTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { currentPage, limit, filter } = req.query as unknown as FetchAllTrainersRequestDTO
            const trainersResult = await this._fetchPendingTrainersUseCase.execute({
                currentPage,
                limit,
                filter: {
                    ...filter,
                    status: TRAINER_STATUS.PENDING
                }
            });

            res.status(HttpStatus.OK).json({
                success: true,
                ...trainersResult
            });
        } catch (error) {
            next(error);
        }
    };

    getTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const trainerDetails = await this._getTrainerDetailsUseCase.execute(trainerId);

            res.status(HttpStatus.OK).json({
                success: true,
                trainer: trainerDetails
            });
        } catch (error) {
            next(error);
        }
    };

    updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { isActive, trainerId }: UpdateTrainerStatusRequestDTO = req.body

            await this._updateStatusUseCase.execute({ isActive, trainerId });

            res.status(HttpStatus.OK).json({
                message: "Account Status Updated",
                success: true
            });
        } catch (error) {
            next(error);
        }
    };

    approveOrRejectTrainer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const approvalPayload = req.body
            await this._handleApprovalUseCase.execute(approvalPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.TRAINER.TRAINER_APPROVAL(req.body.action)
            });
        } catch (error) {
            next(error);
        }
    };
}