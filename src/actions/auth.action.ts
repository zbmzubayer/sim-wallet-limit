"use server";

import type { AdapterUser } from "next-auth/adapters";

import { ENV } from "@/config/env";
import type { LoginDto } from "@/validations/auth.dto";

export const loginWithCredentials = async (
  payload: LoginDto
): Promise<AdapterUser> => {
  if (ENV.SUPER_ADMIN_USERNAME !== payload.username)
    throw new Error("Username does not match");
  if (ENV.SUPER_ADMIN_PASSWORD !== payload.password)
    throw new Error("Password does not match");

  return {
    id: "1",
    name: "Super Admin",
    email: payload.username,
    username: payload.username,
    emailVerified: null,
  };
};
