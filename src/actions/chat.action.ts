"use server";

import prisma from "@/lib/prisma";

export const getAllChats = async () => {
  return await prisma.chat.findMany({
    orderBy: { createdAt: "desc" },
  });
};
