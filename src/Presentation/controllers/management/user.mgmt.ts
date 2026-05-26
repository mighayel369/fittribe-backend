import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { HttpStatus } from 'utils/HttpStatus';
import { AppError } from 'domain/errors/AppError';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_FETCH_ALL_USERS_TOKEN, IFetchAllUsersUseCase } from 'application/interfaces/user/i-fetch-all-users.usecase';
import { I_UPDATE_USER_STATUS_TOKEN, IUpdateStatus } from 'application/interfaces/common/i-update-status.usecase';
import { FetchAllUsersQueryInput } from 'application/dto/management/user-management/all-users.dto';
import { FILE_CONSTANTS } from 'utils/Constants';
import { I_EXPORT_CHURN_USERS, IExportChurnUsers } from 'application/interfaces/user/i-export-churn-users';
import { FileResponseHelper } from 'utils/file.constants';
import { IFetchUserProfileUseCase, I_FETCH_USER_DETAILS_ADMIN_TOKEN } from 'application/interfaces/user/i-fetch-user-details.usecase';
import { UpdateUserStatusRequestDTO } from 'application/dto/management/user-management/update-user-status.dto';
import { AdminUserDetailDTO } from 'application/dto/management/user-management/user-profile.dto';
import { ChurnUserQueryDTO } from 'application/dto/management/user-management/churn-user-query.schema';

@injectable()
export class UserManagementController {
    constructor(
        @inject(I_FETCH_ALL_USERS_TOKEN)
        private readonly _fetchAllUsersUseCase: IFetchAllUsersUseCase,

        @inject(I_FETCH_USER_DETAILS_ADMIN_TOKEN)
        private readonly _fetchUserDetailsUseCase: IFetchUserProfileUseCase<AdminUserDetailDTO>,

        @inject(I_UPDATE_USER_STATUS_TOKEN)
        private readonly _updateUserStatusUseCase: IUpdateStatus<UpdateUserStatusRequestDTO>,

        @inject(I_EXPORT_CHURN_USERS)
        private readonly _exportChurnUsers: IExportChurnUsers,
    ) { }


    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const queryInput = req.query as unknown as FetchAllUsersQueryInput;

            const usersData = await this._fetchAllUsersUseCase.execute(
                queryInput
            );

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.ADMIN.USER_RETRIEVED,
                ...usersData
            });

        } catch (error) {
            next(error);
        }
    };

    getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;

            if (!userId) throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST)

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
            const { userId, isActive }: UpdateUserStatusRequestDTO = req.body;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.MISSING_REQUIRED_DATA, HttpStatus.BAD_REQUEST);
            }

            await this._updateUserStatusUseCase.execute({ userId, isActive });

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

            const { range } = req.query as unknown as ChurnUserQueryDTO

            const response = await this._exportChurnUsers.execute(range);

            FileResponseHelper.sendPdf(
                res,
                response,
                FILE_CONSTANTS.CHURN_USERS_REPORT
            );
        } catch (err) {

            next(err)
        }
    }
}