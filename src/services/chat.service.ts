import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export const createOrGetChat = async (
  userAId: string,
  userBId: string
) => {
  if (userAId === userBId) {
    throw new AppError(
      "Cannot create a chat with yourself",
      400
    );
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [userAId, userBId],
      },
    },
  });

  if (users.length !== 2) {
    throw new AppError(
      "One or both users do not exist",
      404
    );
  }

  const [firstUserId, secondUserId] = [
    userAId,
    userBId,
  ].sort();

  const directKey = `${firstUserId}:${secondUserId}`;

  const existingChat = await prisma.chat.findUnique({
    where: {
      directKey,
    },
  });

  if (existingChat) {
    return existingChat;
  }

  try {
    const chat = await prisma.chat.create({
      data: {
        type: "DIRECT",
        directKey,
        members: {
          create: [
            {
              userId: userAId,
            },
            {
              userId: userBId,
            },
          ],
        },
      },
      include: {
        members: true,
      },
    });

    return chat;
  } catch (error) {
    // Handles race condition if two requests create
    // the same direct chat simultaneously.

    const chat = await prisma.chat.findUnique({
      where: {
        directKey,
      },
    });

    if (chat) {
      return chat;
    }

    throw error;
  }
};

export const getUserChats = async (
  userId: string
) => {
  const chats = await prisma.chat.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },

    include: {
      members: {
        select: {
          userId: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return chats.map((chat) => ({
    chatId: chat.id,
    type: chat.type,
    memberIds: chat.members.map(
      (member) => member.userId
    ),
    createdAt: chat.createdAt,
  }));
};

export const verifyChatMember = async (
  chatId: string,
  userId: string
) => {
  const member = await prisma.chatMember.findUnique({
    where: {
      chatId_userId: {
        chatId,
        userId,
      },
    },
  });

  if (!member) {
    throw new AppError(
      "User is not a member of this chat",
      403
    );
  }

  return member;
};