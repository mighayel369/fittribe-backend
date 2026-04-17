import express from "express";
import { container } from "tsyringe";
import { TrainerChatController } from "Presentation/controllers/chat/trainer.chat.controller";
import { trainerChatQuerySchema } from "Presentation/validators/chat.schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";
const router = express.Router();
const ctrl = container.resolve(TrainerChatController);


router.get(
    '/chat-list', 
    validateRequest(trainerChatQuerySchema, "query"), 
    ctrl.getEstablishedChats
);

router.get(
    '/non-chat-list', 
    validateRequest(trainerChatQuerySchema, "query"), 
    ctrl.getDiscoveryClients
);
export default router;