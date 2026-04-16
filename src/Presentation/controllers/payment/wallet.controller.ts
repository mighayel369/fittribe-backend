import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from "tsyringe";
import { HttpStatus } from 'utils/HttpStatus';
import { SUCCESS_MESSAGES } from 'utils/SuccessMessages';
import { WalletDetailsResponseDTO, WalletTransactionInputDTO } from 'application/dto/wallet/WalletTransactionsDTO';
import { I_GET_WALLET_USE_CASE_TOKEN, IGetWalletUseCase } from 'application/interfaces/wallet/IGetWalletUseCase';
@injectable()
export class WalletController {
    constructor(
        @inject(I_GET_WALLET_USE_CASE_TOKEN) private _getWallet: IGetWalletUseCase,
    ) { }

    getMyWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user as { id: string };
            const { limit, search } = req.query;
            const input: WalletTransactionInputDTO = {
                ownerId: id,
                currentPage: Math.max(1, Number(req.query.pageNo) || 1),
                limit: Number(limit) || 10,
                searchQuery: (search as string) || ""
            }
            const result: WalletDetailsResponseDTO = await this._getWallet.execute(input);

            res.status(HttpStatus.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.WALLET.WALLET_DETAILS_FETCHED,
                wallet: result
            });
        } catch (err) {
            next(err);
        }
    };
}