export const ENV = {
  AUTH_SECRET: process.env.AUTH_SECRET || "default_secret",
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME || "admin",
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "password",
  BK_SM_LIMIT: Number(process.env.LIMIT_BK_SM) || 300000,
  BK_CO_LIMIT: Number(process.env.LIMIT_BK_CO) || 200000,
  NG_SM_LIMIT: Number(process.env.LIMIT_NG_SM) || 300000,
  NG_CO_LIMIT: Number(process.env.LIMIT_NG_CO) || 200000,
};
