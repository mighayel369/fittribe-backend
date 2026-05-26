import { WalletTransactionQuerySchema } from "application/dto/wallet/wallet-transaction.request.dto";
import express from "express";
import { WalletController } from "Presentation/controllers/payment/wallet.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { container } from "tsyringe";

const ctrl = container.resolve(WalletController)
const router = express.Router()

router.get('/my-wallet', validateRequest(WalletTransactionQuerySchema, 'query'), ctrl.getMyWallet);

export default router