import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_UPDATE_STATUS_TOKEN, IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { UpdateStatusRequestDTO, UpdateStatusResponseDTO } from 'application/dto/common/update-status.dto';
import { TrainerApprovalRequestDTO, TrainerApprovalResponseDTO } from 'application/dto/trainer/trainer-approval.dto';
import { I_HANDLE_TRAINER_APPROVAL_TOKEN, IHandleTrainerApproval } from 'application/interfaces/trainer/i-handle-trainer-approval.usecase';
import { I_FETCH_ALL_PENDING_TRAINERS_TOKEN, I_FETCH_ALL_TRAINERS_TOKEN, IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { FetchAllPendingTrainersResponseDTO, FetchAllTrainersRequestDTO, FetchAllTrainersResponseDTO, FetchAllClientTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN, IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { TrainerDetailsResponseDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { PAGINATION } from 'utils/Constants';
import { trainerParams } from 'Presentation/interfaces/request.params';
@injectable()
export class TrainerManagementController {
    constructor(
        @inject(I_UPDATE_STATUS_TOKEN) private _toggleStatus: IUpdateStatus,
        @inject(I_FETCH_TRAINER_DETAILS_ADMIN_TOKEN) private _getDetails: IFetchTrainerDetails<TrainerDetailsResponseDTO>,
        @inject(I_FETCH_ALL_TRAINERS_TOKEN) private _getVerified: IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>,
        @inject(I_FETCH_ALL_PENDING_TRAINERS_TOKEN) private _getPending: IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>,
        @inject(I_HANDLE_TRAINER_APPROVAL_TOKEN) private _handleApproval: IHandleTrainerApproval,
    ) { }

    private _getPaginationParams = (req: Request): FetchAllTrainersRequestDTO => ({
        searchQuery: (req.query.search as string) || "",
        limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
        currentPage: Math.max(1, Number(req.query.pageNo) || 1),
        filter: {}
    });

    getVerifiedTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._getVerified.execute(this._getPaginationParams(req));
            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (error) { next(error); }
    };

    getPendingTrainers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._getPending.execute(this._getPaginationParams(req));
            res.status(HttpStatus.OK).json({ success: true, ...result });
        } catch (error) { next(error); }
    };

    getTrainerDetails = async (req:Request<trainerParams>, res: Response, next: NextFunction) => {
        try {
            const { trainerId } = req.params
            const result = await this._getDetails.execute(trainerId);
            res.status(HttpStatus.OK).json({ success: true, trainer: result });
        } catch (error) { next(error); }
    };


    updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: UpdateStatusRequestDTO = {
                id: req.body.trainerId,
                isActive: req.body.status
            };
            const result = await this._toggleStatus.execute(payload);
            res.status(HttpStatus.OK).json(result);
        } catch (error) { next(error); }
    };

    approveOrRejectTrainer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input: TrainerApprovalRequestDTO = {
                trainerId: req.body.trainerId,
                action: req.body.action,
                reason: req.body.reason
            };

            const result = await this._handleApproval.execute(input);
            res.status(HttpStatus.OK).json(result);
        } catch (error) { next(error); }
    };
}