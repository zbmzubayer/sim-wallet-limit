"use server";

import { revalidateTag, unstable_cache } from "next/cache";

import prisma from "@/lib/prisma";

export const getAllChats = unstable_cache(
  async () => {
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
  },
  ["chats"],
  { tags: ["chats"] }
);

export const invalidateChats = async () => {
  revalidateTag("chats");
};
