import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { I_GET_WALLET_USE_CASE_TOKEN, IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';
import { AppError } from 'domain/errors/AppError';
import { ERROR_MESSAGES } from 'utils/ErrorMessage';
import { WalletTransactionQueryDTO } from 'application/dto/wallet/wallet-transaction.request.dto';
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

            const query = req.query as unknown as WalletTransactionQueryDTO

            const walletDetails = await this._getWalletDetailsUseCase.execute(query, userId);

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