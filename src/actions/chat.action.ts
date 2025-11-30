"use server";

import prisma from "@/lib/prisma";

export const getAllChats = async () => {
  return await prisma.chat.findMany({
    include: {
      devices: { include: { sims: true } },
    },
    orderBy: { id: "desc" },
  });
};
