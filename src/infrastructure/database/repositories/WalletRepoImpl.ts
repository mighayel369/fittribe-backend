
import { injectable } from "tsyringe";
import { Model } from "mongoose";
import WalletModel, { IWallet } from "../models/WalletModel";
import { BaseRepository } from "./BaseRepository";
import { WalletEntity } from "domain/entities/WalletEntity";
import { IWalletRepo } from "domain/repositories/IWalletRepo";
import { HOLD_STATUS, TRANSACTION_SOURCE, TRANSACTION_TYPE } from "domain/constants/wallet-constants";
import { AppError } from "domain/errors/AppError";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class WalletRepoImpl
  extends BaseRepository<IWallet>
  implements IWalletRepo {

  protected model: Model<IWallet> = WalletModel;

  async createWallet(ownerId: string): Promise<WalletEntity> {
    const wallet = await this.model.create({
      ownerId,
      balance: 0,
      holds: [],
      transactions: []
    });
    return wallet;
  }

  async credit(
    ownerId: string,
    amount: number,
    source: TRANSACTION_SOURCE,
    bookingId?: string
  ): Promise<WalletEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { ownerId },
      {
        $inc: { balance: amount },
        $push: {
          transactions: {
            type: TRANSACTION_TYPE.CREDIT,
            amount,
            source,
            bookingId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    return doc ? doc : null;
  }

  async holdAmount(ownerId: string, bookingId: string, amount: number): Promise<void> {
    await this.model.findOneAndUpdate(
      { ownerId },
      { $push: { holds: { bookingId, amount, status: HOLD_STATUS.ACTIVE } } }
    );
  }

  async convertHoldToBalance(ownerId: string, bookingId: string): Promise<WalletEntity | null> {
    const walletDoc = await this.model.findOne({ ownerId });
    if (!walletDoc) return null;

    const hold = walletDoc.holds.find(h => h.bookingId.toString() === bookingId && h.status === HOLD_STATUS.ACTIVE);
    if (!hold) throw new AppError(ERROR_MESSAGES.NOT_FOUND, HttpStatus.NOT_FOUND);

    const doc = await this.model.findOneAndUpdate(
      { ownerId },
      {
        $inc: { balance: hold.amount },
        $pull: { holds: { bookingId: bookingId } },
        $push: {
          transactions: {
            type: TRANSACTION_TYPE.CREDIT,
            amount: hold.amount,
            source: TRANSACTION_SOURCE.BOOKING,
            bookingId,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    return doc ? doc : null;
  }

  async releaseHoldWithoutBalance(ownerId: string, bookingId: string): Promise<WalletEntity | null> {
    const doc = await this.model.findOneAndUpdate(
      { ownerId },
      { $pull: { holds: { bookingId: bookingId } } },
      { new: true }
    );
    return doc ? doc : null;
  }

  async getWalletWithPaginatedTransactions(ownerId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const result = await this.model.aggregate([
      { $match: { ownerId } },
      {
        $project: {
          ownerId: 1,
          balance: 1,
          holds: 1,
          totalTransactions: { $size: "$transactions" },
          transactions: { $slice: [{ $reverseArray: "$transactions" }, skip, limit] }
        }
      }
    ]);

    if (!result || result.length === 0) return null;

    const data = result[0];

    return {
      wallet: data,
      totalTransactions: data.totalTransactions
    };
  }
}