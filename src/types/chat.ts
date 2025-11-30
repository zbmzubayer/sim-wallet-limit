import type {
  Device,
  Prisma,
  SimTransactionHistory,
  User,
} from "@/generated/prisma";

export type ChatTableData = Prisma.ChatGetPayload<{
  include: { devices: { include: { sims: true } } };
}>;

export type TransactionHistory = SimTransactionHistory;

export type ChatDevice = Device;

export type SimTableData = Prisma.SimGetPayload<{
  include: { device: true };
}>;

export type UserTableData = User;
