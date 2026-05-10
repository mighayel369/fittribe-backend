import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_ALL_USERS_TOKEN, IFetchAllUsersUseCase } from 'application/interfaces/user/i-fetch-all-users.usecase';
import { I_FETCH_USER_DETAILS_ADMIN_TOKEN, IFetchUserDetailsUseCase } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { AdminUserDetailDTO } from 'application/dto/user/user-details.dto';
import { I_UPDATE_USER_STATUS_TOKEN, IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { FetchAllUsersRequestDTO, FetchAllUsersResponseDTO } from 'application/dto/user/fetch-all-users.dto';
import { UpdateStatusRequestDTO } from 'application/dto/common/update-status.dto';
import { DATE_RANGES, FILE_CONSTANTS, PAGINATION, USER_STATUS_FILTERS } from 'utils/Constants';
import { UserParams } from 'Presentation/interfaces/request.params';
import { I_EXPORT_CHURN_USERS, IExportChurnUsers } from 'application/interfaces/user/i-export-churn-users';
import { FileResponseHelper } from 'utils/file.constants';

@injectable()
export class UserManagementController {
    constructor(
        @inject(I_FETCH_ALL_USERS_TOKEN)
        private readonly _fetchAllUsersUseCase: IFetchAllUsersUseCase,

        @inject(I_FETCH_USER_DETAILS_ADMIN_TOKEN)
        private readonly _fetchUserDetailsUseCase: IFetchUserDetailsUseCase<AdminUserDetailDTO>,

        @inject(I_UPDATE_USER_STATUS_TOKEN)
        private readonly _updateUserStatusUseCase: IUpdateStatus,

        @inject(I_EXPORT_CHURN_USERS)
        private readonly _exportChurnUsers: IExportChurnUsers,
    ) { }

    private _parsePaginationQuery = (req: Request): FetchAllUsersRequestDTO => {
        const { pageNo, limit, search, status } = req.query;

        const parsedPage = typeof pageNo === 'string' ? parseInt(pageNo, 10) : 1;
        const currentPage = (isNaN(parsedPage) || parsedPage <= 0) ? 1 : parsedPage;


        const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : PAGINATION.DEFAULT_LIMIT;
        const safeLimit = (isNaN(parsedLimit) || parsedLimit <= 0) ? PAGINATION.DEFAULT_LIMIT : parsedLimit;


        const searchStr = typeof search === 'string' ? search : "";
        const statusStr = Object.values(USER_STATUS_FILTERS).includes(status as USER_STATUS_FILTERS)
            ? (status as USER_STATUS_FILTERS)
            : USER_STATUS_FILTERS.ALL;
        return {
            currentPage,
            limit: safeLimit,
            filter: {
                search: searchStr,
                status: statusStr
            }
        };
    };

    private isValidRange(range: unknown): range is DATE_RANGES {
        return Object.values(DATE_RANGES).includes(range as DATE_RANGES);
    }


    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const queryParams = this._parsePaginationQuery(req);

            const usersData: FetchAllUsersResponseDTO =
                await this._fetchAllUsersUseCase.execute(queryParams);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.ADMIN.USER_RETRIEVED,
                ...usersData
            });
        } catch (error) {
            next(error);
        }
    };

    getUserDetails = async (req: Request<UserParams>, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const userProfile = await this._fetchUserDetailsUseCase.execute(userId);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_DETAILS_FETCHED,
                user: userProfile
            });
        } catch (error) {
            next(error);
        }
    };

    toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, status } = req.body;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            const statusPayload: UpdateStatusRequestDTO = {
                id: userId,
                isActive: status
            };

            await this._updateUserStatusUseCase.execute(statusPayload);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.USER.USER_STATUS_UPDATED
            })
        } catch (error) {
            next(error);
        }
    };



    exportChurnUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { range } = req.query
            if (!this.isValidRange(range)) {
                throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HttpStatus.BAD_REQUEST)
            }

            const response = await this._exportChurnUsers.execute(range)
            FileResponseHelper.sendPdf(res, response, FILE_CONSTANTS.CHURN_USERS_REPORT)
        } catch (err) {

            next(err)
        }
    }
}