import { TRANSACTION_SOURCE, TRANSACTION_TYPE } from "domain/constants/wallet-constants";
import { PaginationInputDTO, PaginationOutputDTO } from "../common/PaginationDto";

export interface WalletTransactionInputDTO extends Omit<PaginationInputDTO, "filter"> {
  ownerId: string;
}

export interface TransactionDTO {
  type: TRANSACTION_TYPE;
  amount: number;
  source: TRANSACTION_SOURCE;
  bookingId?: string;
  createdAt: string;
}


export interface WalletDetailsResponseDTO extends PaginationOutputDTO<TransactionDTO> {
  balance: number;
  activeHoldCount: number
}