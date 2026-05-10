import { WalletTransaction } from "domain/entities/types/wallet.types";
import { TransactionDTO } from "application/dto/wallet/WalletTransactionsDTO";

export class WalletMapper {
  static toTransactionDTO(transaction: WalletTransaction): TransactionDTO {
    return {
      type: transaction.type,
      amount: transaction.amount,
      bookingId: transaction.bookingId,
      source: transaction.source,
      createdAt: transaction.createdAt.toISOString()
    }
  }
}