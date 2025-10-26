import type { Device, Prisma, SimTransactionHistory } from "@/generated/prisma";

export type ChatTableData = Prisma.ChatGetPayload<{
  include: { devices: { include: { deviceSims: { include: { sim: true } } } } };
}>;

export type TransactionHistory = SimTransactionHistory;

export type ChatDevice = Device;
