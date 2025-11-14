export const USER_ROLE = {
  superAdmin: "SuperAdmin",
  admin: "Admin",
};

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type SimLimit = {
  bkSMLimit: number;
  bkCOLimit: number;
  ngSMLimit: number;
  ngCOLimit: number;
};
