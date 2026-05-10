import { WalletHold, WalletTransaction } from "./types/wallet.types";

export class WalletEntity {
  constructor(
    public readonly ownerId: string,
    public balance: number,
    public holds: WalletHold[],
    public transactions: WalletTransaction[],
  ) { }

}
