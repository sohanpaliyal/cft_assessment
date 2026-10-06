import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createOrGetChat,
} from "../services/chat.service";

import {
  sendMessage,
  getMessages,
  markMessageRead,
  updateLastSeen,
} from "../services/message.service";

import {
  createChatSchema,
  sendMessageSchema,
  markReadSchema,
  lastSeenSchema,
} from "../schemas/chat.schema";


type ChatIdParams = {
  chatId: string;
};
export const createChatController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = createChatSchema.parse(req.body);

    const chat = await createOrGetChat(
      body.userAId,
      body.userBId
    );

    res.status(200).json({
      success: true,
      chatId: chat.id,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessageController = async (
   req: Request<ChatIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    const body = sendMessageSchema.parse(req.body);

    const message = await sendMessage(
      chatId,
      body.senderId,
      body.text
    );

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessagesController = async (
  req: Request<ChatIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    const limit = Number(
      req.query.limit ?? 50
    );

    const messages = await getMessages(
      chatId,
      limit
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const markReadController = async (
 req: Request<ChatIdParams & {messageId : string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      chatId,
      messageId,
    } = req.params;

    const body = markReadSchema.parse(req.body);

    await markMessageRead(
      chatId,
      messageId,
      body.userId
    );

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    next(error);
  }
};

export const updateLastSeenController = async (
   req: Request<ChatIdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;

    const body = lastSeenSchema.parse(req.body);

    await updateLastSeen(
      chatId,
      body.userId,
      body.messageId
    );

    res.status(200).json({
      success: true,
      message: "Last seen updated",
    });
  } catch (error) {
    next(error);
  }
};