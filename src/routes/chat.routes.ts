import { Router } from "express";

import {
  createChatController,
  sendMessageController,
  getMessagesController,
  markReadController,
  updateLastSeenController,
} from "../controllers/chat.controller";

const router = Router();

router.post(
  "/create",
  createChatController
);

router.post(
  "/:chatId/message/send",
  sendMessageController
);

router.get(
  "/:chatId/messages",
  getMessagesController
);

router.post(
  "/:chatId/message/:messageId/read",
  markReadController
);

router.post(
  "/:chatId/lastseen",
  updateLastSeenController
);

export default router;