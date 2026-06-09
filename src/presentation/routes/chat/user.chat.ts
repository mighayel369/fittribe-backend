import express from "express";
import { container } from "tsyringe";
import { UserChatController } from "presentation/controllers/chat/user.chat.controller";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { ChatQuerySchema } from "application/dto/chat/shared/chat-query.schema";
const router = express.Router();
const ctrl = container.resolve(UserChatController);

router.get(
    '/chat-list',
    validateRequest(ChatQuerySchema, "query"),
    ctrl.getEstablishedChats
);

export default router;