import express from "express";
import { container } from "tsyringe";
import { UserChatController } from "Presentation/controllers/chat/user.chat.controller";
const router = express.Router();
const ctrl = container.resolve(UserChatController);

router.get('/chat-list', ctrl.getEstablishedChats);

export default router;