import {
  firestore,
  FieldValue,
} from "../config/firebase";

import { AppError } from "../utils/AppError";

import {
  verifyChatMember,
} from "./chat.service";

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string
) => {
  await verifyChatMember(chatId, senderId);

  const messageRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc();

  await messageRef.set({
    senderId,
    text,
    createdAt:
      FieldValue.serverTimestamp(),

    editedAt: null,
    deletedAt: null,
  });

  return {
    id: messageRef.id,
    senderId,
    text,
  };
};

export const getMessages = async (
  chatId: string,
  limit = 50
) => {
  const safeLimit = Math.min(
    Math.max(limit, 1),
    100
  );

  const snapshot = await firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("createdAt", "desc")
    .limit(safeLimit)
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse();
};

export const markMessageRead = async (
  chatId: string,
  messageId: string,
  userId: string
) => {
  await verifyChatMember(chatId, userId);

  const messageRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(messageId);

  const message = await messageRef.get();

  if (!message.exists) {
    throw new AppError(
      "Message not found",
      404
    );
  }

  const readRef = messageRef
    .collection("reads")
    .doc(userId);

  await readRef.set(
    {
      readAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return {
    messageId,
    userId,
  };
};

export const updateLastSeen = async (
  chatId: string,
  userId: string,
  messageId: string
) => {
  await verifyChatMember(chatId, userId);

  const messageRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(messageId);

  const message = await messageRef.get();

  if (!message.exists) {
    throw new AppError(
      "Message not found",
      404
    );
  }

  const lastSeenRef = firestore
    .collection("chats")
    .doc(chatId)
    .collection("lastSeen")
    .doc(userId);

  await lastSeenRef.set(
    {
      messageId,

      updatedAt:
        FieldValue.serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return {
    userId,
    messageId,
  };
};