import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { UpdateStatusRequestDTO, UpdateStatusResponseDTO } from 'application/dto/common/update-status.dto';
import { TrainerApprovalRequestDTO, TrainerApprovalResponseDTO } from 'application/dto/trainer/trainer-approval.dto';
import { IHandleTrainerApproval } from 'application/interfaces/trainer/i-handle-trainer-approval.usecase';
import { IFetchAllTrainersUseCase } from 'application/interfaces/trainer/i-fetch-all-trainers.usecase';
import { FetchAllPendingTrainersResponseDTO, FetchAllTrainersRequestDTO, FetchAllTrainersResponseDTO, FetchAllClientTrainersResponseDTO } from 'application/dto/trainer/fetch-all-trainers.dto';
import { IFetchTrainerDetails } from 'application/interfaces/trainer/i-fetch-trainer-details.usecase';
import { TrainerDetailsResponseDTO } from 'application/dto/trainer/fetch-trainer-details.dto';
import { PAGINATION } from 'utils/Constants';
@injectable()
export class TrainerManagementController {
    constructor(
        @inject("BlockUnblockTrainerUseCase") private _toggleStatus: IUpdateStatus,
        @inject("FetchTrainerDetailsForAdmin") private _getDetails: IFetchTrainerDetails<TrainerDetailsResponseDTO>,
        @inject("FindAllTrainersUseCase") private _getVerified: IFetchAllTrainersUseCase<FetchAllTrainersResponseDTO>,
        @inject("FindAllPendingTrainers") private _getPending: IFetchAllTrainersUseCase<FetchAllPendingTrainersResponseDTO>,
        @inject("TrainerVerificationUseCase") private _handleApproval: IHandleTrainerApproval,
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

    getTrainerDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this._getDetails.execute(req.params.id);
            res.status(HttpStatus.OK).json({ success: true, trainer: result });
        } catch (error) { next(error); }
    };


    updateAccountStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: UpdateStatusRequestDTO = {
                id: req.params.id,
                isActive: req.body.status
            };
            const result = await this._toggleStatus.execute(payload);
            res.status(HttpStatus.OK).json(result);
        } catch (error) { next(error); }
    };

    approveOrRejectTrainer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const input: TrainerApprovalRequestDTO = {
                trainerId: req.params.id,
                action: req.body.action,
                reason: req.body.reason
            };

            const result = await this._handleApproval.execute(input);
            res.status(HttpStatus.OK).json(result);
        } catch (error) { next(error); }
    };
}