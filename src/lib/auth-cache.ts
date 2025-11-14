import "server-only";

import { ENV } from "@/config/env";
import prisma from "@/lib/prisma";

export async function isUserAuthorized(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { username } });

  return !!user || ENV.SUPER_ADMIN_USERNAME === username;
}
