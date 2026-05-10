import { inject, injectable } from "tsyringe";
import { I_WALLET_REPO_TOKEN, IWalletRepo } from "domain/repositories/IWalletRepo";
import { IGetWalletUseCase } from "application/interfaces/wallet/IGetWalletUseCase";
import { WalletMapper } from "application/mappers/WalletTransactionMapper";
import {
  WalletTransactionInputDTO,
  WalletDetailsResponseDTO
} from "application/dto/wallet/WalletTransactionsDTO";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject(I_WALLET_REPO_TOKEN)
    private readonly _walletRepository: IWalletRepo
  ) { }


  async execute(queryInput: WalletTransactionInputDTO): Promise<WalletDetailsResponseDTO> {
    const { ownerId, currentPage, limit } = queryInput;

    const walletResult = await this._walletRepository.getWalletWithPaginatedTransactions(
      ownerId,
      currentPage,
      limit
    );

    if (!walletResult) {
      await this._walletRepository.createWallet(ownerId);
      return {
        balance: 0,
        data: [],
        activeHoldCount: 0,
        total: 0
      };
    }


    const mappedTransactions = walletResult.wallet.transactions.map(transaction =>
      WalletMapper.toTransactionDTO(transaction)
    );

    return {
      balance: walletResult.wallet.balance,
      data: mappedTransactions,
      activeHoldCount: walletResult.wallet.holds.length,
      total: walletResult.totalTransactions
    };
  }
}