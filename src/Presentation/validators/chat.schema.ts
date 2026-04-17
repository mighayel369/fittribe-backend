import { z } from 'zod';

export const chatIdSchema = z.object({
  chatId: z.string().min(1,"Invalid Chat ID format")
});

export const receiverIdSchema = z.object({
  receiverId: z.string().min(1,"Invalid Chat ID format")
});

export const trainerChatQuerySchema = z.object({
  search: z.string().optional().default(""),
});

export const chatListQuerySchema = z.object({
  search: z.string().max(100).optional().default(""),
});