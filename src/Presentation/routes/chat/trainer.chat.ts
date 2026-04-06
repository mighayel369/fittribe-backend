import express from "express";
import { container } from "tsyringe";
import { TrainerChatController } from "Presentation/controllers/chat/trainer.chat.controller";
const router = express.Router();
const ctrl = container.resolve(TrainerChatController);

router.get('/chat-list', ctrl.getEstablishedChats);
router.get('/non-chat-list',ctrl.getDiscoveryClients)
export default router;