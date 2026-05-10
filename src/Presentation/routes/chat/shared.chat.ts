import express from "express";
import { container } from "tsyringe";
import { SharedChatController } from "Presentation/controllers/chat/shared.chat.controller";
import { chatIdSchema, receiverIdSchema } from "Presentation/validators/chat.schema";
import { validateRequest } from "Presentation/middleware/validate.middleware";
import { upload } from "Presentation/middleware/upload";
const router = express.Router();
const ctrl = container.resolve(SharedChatController);


router.get('/chat-id/:receiverId', validateRequest(receiverIdSchema, 'params'), ctrl.getChatId);
router.get('/messages/:chatId', validateRequest(chatIdSchema, 'params'), ctrl.getMessages);
router.patch('/mark-as-read/:chatId', validateRequest(chatIdSchema, 'params'), ctrl.markMessageAsRead);

router.post('/upload-file', upload.single('file'), ctrl.uploadChatFile);
export default router;