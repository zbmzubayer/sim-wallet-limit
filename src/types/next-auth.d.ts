import type { DefaultSession } from "next-auth";

import type { UserRole } from "@/types";

declare module "next-auth" {
  interface User {
    username: string;
    role: UserRole;
  }
  interface Session {
    user: {
      id: number;
      username: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
    role: UserRole;
  }
}
