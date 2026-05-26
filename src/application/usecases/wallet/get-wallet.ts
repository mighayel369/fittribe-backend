import { inject, injectable } from "tsyringe";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IGetWalletUseCase } from "application/interfaces/wallet/IGetWalletUseCase";
import { WalletMapper } from "application/mappers/WalletTransactionMapper";
import {
  WalletDetailsResponseDTO,
  WalletDetailsResponseSchema
} from "application/dto/wallet/wallet-transaction.response.dto";

import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { WalletTransactionQueryDTO } from "application/dto/wallet/wallet-transaction.request.dto";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {

  constructor(
    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo
  ) { }

  async execute(queryInput: WalletTransactionQueryDTO, ownerId: string): Promise<WalletDetailsResponseDTO> {

    const { currentPage, limit } = queryInput;

    if (currentPage <= 0 || limit <= 0) {
      throw new AppError(ERROR_MESSAGES.INVALID_PAGINATION, HttpStatus.BAD_REQUEST);
    }

    const walletResult = await this._walletRepository.getWalletWithPaginatedTransactions(
      ownerId,
      currentPage,
      limit
    );

    if (!walletResult) {
      await this._walletRepository.createWallet(
        ownerId
      );

      return WalletDetailsResponseSchema.parse({
        balance: 0,
        data: [],
        activeHoldCount: 0,
        totalPages: 0,
        currentPage,
        totalCount: 0
      });
    }

    const mappedTransactions =
      walletResult.wallet.transactions.map(
        transaction =>
          WalletMapper.toTransactionDTO(transaction)
      );

    return WalletDetailsResponseSchema.parse({
      balance: walletResult.wallet.balance,
      data: mappedTransactions,
      activeHoldCount: walletResult.wallet.holds.length,
      totalPages: Math.ceil(walletResult.totalTransactions / limit),
      currentPage,
      totalCount: walletResult.totalTransactions
    });
  }
}