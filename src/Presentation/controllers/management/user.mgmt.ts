import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import config from 'config';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_ALL_USERS_TOKEN, IFetchAllUsersUseCase } from 'application/interfaces/user/i-fetch-all-users.usecase';
import { I_FETCH_USER_DETAILS_ADMIN_TOKEN, IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { AdminUserDetailDTO } from 'application/dto/user/user-details.dto';
import { I_UPDATE_USER_STATUS_TOKEN, IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { FetchAllUsersRequestDTO, FetchAllUsersResponseDTO } from 'application/dto/user/fetch-all-users.dto';
import { UpdateStatusRequestDTO, UpdateStatusResponseDTO } from 'application/dto/common/update-status.dto';
import { PAGINATION } from 'utils/Constants';
@injectable()
export class UserManagementController {
    constructor(
        @inject(I_FETCH_ALL_USERS_TOKEN) private _findAllUsers: IFetchAllUsersUseCase,
        @inject(I_FETCH_USER_DETAILS_ADMIN_TOKEN) private _findDetails: IFetchUserDetailsUseCase<AdminUserDetailDTO>,
        @inject(I_UPDATE_USER_STATUS_TOKEN) private _updateStatus: IUpdateStatus,
    ) { }

    private _getPaginationParams = (req: Request): FetchAllUsersRequestDTO => ({
        currentPage: Math.max(1, Number(req.query.pageNo) || 1),
        limit: Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT,
        searchQuery: (req.query.search as string) || "",
        filter: {}
    });

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result: FetchAllUsersResponseDTO = await this._findAllUsers.execute(
                this._getPaginationParams(req)
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.ADMIN.USER_RETRIEVED,
                ...result
            });
        } catch (error) { next(error); }
    };

    getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = await this._findDetails.execute(req.params.id);
            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
                user: userData
            });
        } catch (error) { next(error); }
    };
    toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: UpdateStatusRequestDTO = {
                id: req.params.id,
                isActive: req.body.status
            };

            const result: UpdateStatusResponseDTO = await this._updateStatus.execute(payload);
            res.status(HttpStatus.OK).json(result);
        } catch (error) { next(error); }
    };
}