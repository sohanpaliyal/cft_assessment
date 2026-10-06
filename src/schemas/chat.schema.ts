import { z } from "zod";

export const createChatSchema = z.object({
  userAId: z.string().uuid(),
  userBId: z.string().uuid(),
});

export const sendMessageSchema = z.object({
  senderId: z.string().uuid(),
  text: z.string().trim().min(1).max(5000),
});

export const markReadSchema = z.object({
  userId: z.string().uuid(),
});

export const lastSeenSchema = z.object({
  userId: z.string().uuid(),
  messageId: z.string().min(1),
});