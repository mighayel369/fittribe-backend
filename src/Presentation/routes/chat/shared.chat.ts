import express from "express";
import { container } from "tsyringe";
import { SharedChatController } from "presentation/controllers/chat/shared.chat.controller";
import { validateRequest } from "presentation/middleware/validate.middleware";
import { upload } from "presentation/middleware/upload";
import { ReceiverParamsSchema } from "application/dto/chat/shared/receiver-param-schema";
import { ChatIdParamsSchema } from "application/dto/chat/shared/chat-id-param.schema";
const router = express.Router();
const ctrl = container.resolve(SharedChatController);


router.get('/chat-id/:receiverId', validateRequest(ReceiverParamsSchema, 'params'), ctrl.getChatId);
router.get('/messages/:chatId', validateRequest(ChatIdParamsSchema, 'params'), ctrl.getMessages);
router.patch('/mark-as-read/:chatId', validateRequest(ChatIdParamsSchema, 'params'), ctrl.markMessageAsRead);

router.post('/upload-file', upload.single('file'), ctrl.uploadChatFile);
export default router;