import {WalletTransactionInputDTO,WalletDetailsResponseDTO } from "application/dto/wallet/WalletTransactionsDTO"

export const I_GET_WALLET_USE_CASE_TOKEN = Symbol("I_GET_WALLET_USE_CASE_TOKEN");

export interface IGetWalletUseCase{
    execute( payload:WalletTransactionInputDTO):Promise<WalletDetailsResponseDTO>
}