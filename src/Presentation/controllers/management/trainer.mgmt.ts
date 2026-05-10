import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { I_UPDATE_STATUS_TOKEN, IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { UpdateStatusRequestDTO } from 'application/dto/common/update-status.dto';
import { TrainerApprovalRequestDTO } from 'application/dto/trainer/trainer-approval.dto';
import { I_HANDLE_TRAINER_APPROVAL_TOKEN, IHandleTrainerApproval } from 'application/interfaces/trainer/i-handle-trainer-approval.usecase';
import { I_FETCH_ALL_PENDING_TRAINERS_TOKEN, I_FETCH_ALL_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { FetchAllPendingTrainersResponseDTO, FetchAllTrainersRequestDTO, FetchAllTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN, IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { PAGINATION } from 'utils/Constants';
import { TRAINER_STATUS } from 'domain/constants/trainer-status';
import { trainerParams } from 'Presentation/interfaces/request.params';
import { AdminTrainerDetails } from 'application/dto/trainer/fetch-trainer-details.dto';
import { GENDER } from 'domain/constants/gender';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
@injectable()
export class TrainerManagementController {
    constructor(
        @inject(I_UPDATE_STATUS_TOKEN)
        private readonly _updateStatusUseCase: IUpdateStatus,

        @inject(I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN)
        private readonly _getTrainerDetailsUseCase: IFetchTrainerDetails<AdminTrainerDetails>,

        @inject(I_FETCH_ALL_TRAINERS_TOKEN)
        private readonly _fetchVerifiedTrainersUseCase: IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>,

        @inject(I_FETCH_ALL_PENDING_TRAINERS_TOKEN)
        private readonly _fetchPendingTrainersUseCase: IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>,

        @inject(I_HANDLE_TRAINER_APPROVAL_TOKEN)
        private readonly _handleApprovalUseCase: IHandleTrainerApproval,
    ) { }

    private isTrainerStatus = (value: unknown): value is TRAINER_STATUS => {
        return Object.values(TRAINER_STATUS).includes(value as TRAINER_STATUS);
    };

    private _getPagination = (req: Request) => {
        const { limit, pageNo } = req.query;

        const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : PAGINATION.DEFAULT_LIMIT;
        const safeLimit = (isNaN(parsedLimit) || parsedLimit <= 0) ? PAGINATION.DEFAULT_LIMIT : parsedLimit;

        const parsedPage = typeof pageNo === 'string' ? parseInt(pageNo, 10) : 1;
        const currentPage = (isNaN(parsedPage) || parsedPage <= 0) ? 1 : parsedPage;

        return { limit: safeLimit, currentPage };
    };

    private isGender = (value: unknown): value is GENDER => {
        return typeof value === 'string' && Object.values(GENDER).includes(value as GENDER);
    };


    private _getAdminQueryParams = (req: Request): FetchAllTrainersRequestDTO => {
        const { status, gender, search } = req.query;
        const { limit, currentPage } = this._getPagination(req);
        const trainerStatus = this.isTrainerStatus(status) ? status : undefined;
        return {
            limit,
            currentPage,
            filter: {
                status: trainerStatus,
                gender: this.isGender(gender) ? gender : undefined,
                search: typeof search === 'string' ? search : ""
            }
        };
    };

    private _getPendingQueryParams = (req: Request): FetchAllTrainersRequestDTO => {
        const { search } = req.query;
        const { limit, currentPage } = this._getPagination(req);

        return {
            limit,
            currentPage,
            filter: {
                search: typeof search === 'string' ? search : ""
            }
        };
    };

    getVerifiedTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._fetchVerifiedTrainersUseCase.execute(
                this._getAdminQueryParams(req)
            );

            res.status(HttpStatus.OK).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    };

    getPendingTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._fetchPendingTrainersUseCase.execute(
                this._getPendingQueryParams(req)
            );

            res.status(HttpStatus.OK).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    };

    getTrainerDetails = async (req: Request<trainerParams>, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params;

            if (!trainerId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const trainerDetails: AdminTrainerDetails = await this._getTrainerDetailsUseCase.execute(trainerId);

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
            const statusPayload: UpdateStatusRequestDTO = {
                id: req.body.trainerId,
                isActive: req.body.status
            };

            await this._updateStatusUseCase.execute(statusPayload);

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
            const approvalPayload: TrainerApprovalRequestDTO = {
                trainerId: req.body.trainerId,
                action: req.body.action,
                reason: req.body.reason
            };

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