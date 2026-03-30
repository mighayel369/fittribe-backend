import express from "express";
import { WalletController } from "Presentation/controllers/payment/wallet.controller";
import { container } from "tsyringe";

const ctrl=container.resolve(WalletController)
const router=express.Router()

router.get('/my-wallet', ctrl.getMyWallet);

export default router