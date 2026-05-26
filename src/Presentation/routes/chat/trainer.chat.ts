import express from "express";
import { container } from "tsyringe";
import { TrainerChatController } from "Presentation/controllers/chat/trainer.chat.controller";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { ChatQuerySchema } from "application/dto/chat/shared/chat-query.schema";
const router = express.Router();
const ctrl = container.resolve(TrainerChatController);


router.get(
    '/chat-list',
    validateRequest(ChatQuerySchema, "query"),
    ctrl.getEstablishedChats
);

router.get(
    '/non-chat-list',
    validateRequest(ChatQuerySchema, "query"),
    ctrl.getDiscoveryClients
);
export default router;