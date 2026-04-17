import express from "express";
import { container } from "tsyringe";
import { UserChatController } from "Presentation/controllers/chat/user.chat.controller";
import { chatListQuerySchema } from "Presentation/validators/chat.schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";
const router = express.Router();
const ctrl = container.resolve(UserChatController);

router.get(
    '/chat-list', 
    validateRequest(chatListQuerySchema, "query"), 
    ctrl.getEstablishedChats
);

export default router;