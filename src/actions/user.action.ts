"use server";

import { revalidatePath } from "next/cache";

import auth from "@/auth";
import prisma from "@/lib/prisma";
import type { ChangePasswordDto, CreateUserDto } from "@/validations/user.dto";

export const createUser = async (payload: CreateUserDto) => {
  await prisma.user.create({ data: payload });
  revalidatePath("/user");
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({ where: { id } });

  revalidatePath("/user");

  return true;
};

export const changePassword = async (payload: ChangePasswordDto) => {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const userId = Number(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new Error("User not found");

  if (user.password !== payload.currentPassword) {
    throw new Error("Current password is incorrect");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: payload.newPassword },
  });

  return true;
};
