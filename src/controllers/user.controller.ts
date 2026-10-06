import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  getUserChats,
} from "../services/chat.service";

export const getUserChatsController = async (
  req: Request<{userId : string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const chats = await getUserChats(userId);

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};