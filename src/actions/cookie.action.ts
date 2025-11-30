"use server";

import { cookies } from "next/headers";

export async function getCookie(key: string) {
  const cookieStore = await cookies();
  const value = cookieStore.get(key)?.value || null;
  return value;
}

export async function setCookie(
  key: string,
  value: string,
  options?: { maxAge?: number; path?: string }
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: key,
    value,
    ...options,
  });
}
