import { WalletDetailsResponseDTO } from "application/dto/wallet/wallet-transaction.response.dto"
import { WalletTransactionQueryDTO } from "application/dto/wallet/wallet-transaction.request.dto";
export const I_GET_WALLET_USE_CASE_TOKEN = Symbol("I_GET_WALLET_USE_CASE_TOKEN");

export interface IGetWalletUseCase {
    execute(payload: WalletTransactionQueryDTO,ownerId:string): Promise<WalletDetailsResponseDTO>
}