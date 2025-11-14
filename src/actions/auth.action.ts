"use server";

import type { AdapterUser } from "next-auth/adapters";

import { ENV } from "@/config/env";
import prisma from "@/lib/prisma";
import { USER_ROLE } from "@/types";
import type { LoginDto } from "@/validations/auth.dto";

export const loginWithCredentials = async (
  payload: LoginDto
): Promise<AdapterUser> => {
  if (ENV.SUPER_ADMIN_USERNAME === payload.username) {
    if (ENV.SUPER_ADMIN_PASSWORD !== payload.password) {
      throw new Error("Invalid credentials");
    }

    return {
      id: "1",
      name: "Super Admin",
      email: payload.username,
      username: payload.username,
      role: USER_ROLE.superAdmin,
      emailVerified: null,
    };
  }
  const user = await prisma.user.findUnique({
    where: { username: payload.username },
  });
  if (!user || user.password !== payload.password) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id.toString(),
    name: user.username,
    email: user.username,
    username: user.username,
    role: USER_ROLE.admin,
    emailVerified: null,
  };
};
