import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { WalletDetailsResponseDTO, WalletTransactionInputDTO } from 'application/dto/wallet/WalletTransactionsDTO';
import { I_GET_WALLET_USE_CASE_TOKEN, IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';
import { PAGINATION } from 'utils/Constants';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
@injectable()
export class WalletController {
    constructor(
        @inject(I_GET_WALLET_USE_CASE_TOKEN)
        private readonly _getWalletDetailsUseCase: IGetWalletUseCase,
    ) { }

    getMyWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.user.id;

            if (!userId) {
                throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const { pageNo, limit } = req.query;


            const parsedPage = typeof pageNo === 'string' ? parseInt(pageNo, 10) : 1;
            const currentPage = (isNaN(parsedPage) || parsedPage <= 0) ? 1 : parsedPage;


            const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : PAGINATION.DEFAULT_LIMIT;
            const safeLimit = (isNaN(parsedLimit) || parsedLimit <= 0) ? PAGINATION.DEFAULT_LIMIT : parsedLimit;

            const walletQueryRequest: WalletTransactionInputDTO = {
                ownerId: userId,
                currentPage,
                limit: safeLimit,
            };

            const walletDetails: WalletDetailsResponseDTO =
                await this._getWalletDetailsUseCase.execute(walletQueryRequest);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.WALLET.WALLET_DETAILS_FETCHED,
                wallet: walletDetails
            });
        } catch (error) {
            next(error);
        }
    };
}