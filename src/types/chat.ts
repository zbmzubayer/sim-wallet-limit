import type { Prisma } from "@/generated/prisma";

export type ChatTableData = Prisma.ChatGetPayload<{
  include: { devices: { include: { deviceSims: { include: { sim: true } } } } };
}>;
