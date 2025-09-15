"use server";

import prisma from "@/lib/prisma";

export const getAllChats = async () => {
  return await prisma.chat.findMany({
    include: {
      devices: {
        include: {
          deviceSims: {
            include: { sim: true },
            orderBy: [{ sim: { bkBalance: "desc" } }],
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });
};
