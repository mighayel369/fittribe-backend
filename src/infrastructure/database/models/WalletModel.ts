
import mongoose, { Schema, Document } from "mongoose";
import { WalletEntity } from "domain/entities/WalletEntity";
import { HOLD_STATUS, TRANSACTION_SOURCE, TRANSACTION_TYPE } from "domain/constants/wallet-constants";
export interface IWallet extends Document, WalletEntity { }

const WalletSchema = new Schema<IWallet>(
  {
    ownerId: { type: String, required: true, trim: true, unique: true },
    balance: { type: Number, default: 0 },
    holds: [
      {
        bookingId: String,
        amount: Number,
        status: {
          type: String,
          enum: Object.values(HOLD_STATUS),
          default: HOLD_STATUS.ACTIVE
        },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    transactions: [
      {
        type: { type: String, enum: Object.values(TRANSACTION_TYPE) },
        amount: Number,
        source: {
          type: String,
          enum: Object.values(TRANSACTION_SOURCE)
        },
        bookingId: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

WalletSchema.index({ ownerId: 1, ownerType: 1 }, { unique: true });

WalletSchema.loadClass(WalletEntity)

export default mongoose.model<IWallet>("Wallet", WalletSchema);
