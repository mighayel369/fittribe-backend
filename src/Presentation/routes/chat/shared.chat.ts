import express from "express";
import { container } from "tsyringe";
import { SharedChatController } from "Presentation/controllers/chat/shared.chat.controller";
const router = express.Router();
const ctrl = container.resolve(SharedChatController);

router.get('/chat-id/:id',ctrl.getChatId)
router.get('/messages/:id',ctrl.getMessages)
router.patch('/mark-as-read/:id',ctrl.markMessageAsRead)
export default router;