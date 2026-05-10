import { TRANSACTION_TYPE, TRANSACTION_SOURCE, HOLD_STATUS } from "../../constants/wallet-constants";

export interface WalletHold {
    bookingId: string;
    amount: number;
    status: HOLD_STATUS;
    createdAt: Date;
}

export interface WalletTransaction {
    type: TRANSACTION_TYPE;
    amount: number;
    source: TRANSACTION_SOURCE;
    bookingId: string;
    createdAt: Date;
}