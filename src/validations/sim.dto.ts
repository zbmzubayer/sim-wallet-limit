import { z } from "zod";

import { SIM_TRANSACTION_OPERATION } from "@/enums/sim.enum";

export const simBalanceSchema = z
  .object({
    operation: z.enum(SIM_TRANSACTION_OPERATION, "Required"),
    amount: z.number("Required"),
    charge: z.number("Required").default(0),
    note: z.string().max(255, "Note must be at most 255 characters").optional(),
  })
  .superRefine((val, ctx) => {
    if (
      (val.operation === SIM_TRANSACTION_OPERATION.BK_SM ||
        val.operation === SIM_TRANSACTION_OPERATION.NG_SM) &&
      val.charge > 15
    ) {
      ctx.addIssue({
        code: "custom",
        message: "SM max charge is 15",
        path: ["charge"],
      });
    }
    if (
      val.operation === SIM_TRANSACTION_OPERATION.BK_CO &&
      val.charge > Number((val.amount * 0.019).toFixed(2))
    ) {
      ctx.addIssue({
        code: "custom",
        message: "BK CO max charge is 1.9%",
        path: ["charge"],
      });
    }
    if (
      val.operation === SIM_TRANSACTION_OPERATION.NG_CO &&
      val.charge > Number((val.amount * 0.016).toFixed(2))
    ) {
      ctx.addIssue({
        code: "custom",
        message: "NG CO max charge is 1.6%",
        path: ["charge"],
      });
    }
  });

export type SimBalanceDto = z.infer<typeof simBalanceSchema>;

export const setSimLimitSchema = z.object({
  bkSMLimit: z.number("Required"),
  bkCOLimit: z.number("Required"),
  ngSMLimit: z.number("Required"),
  ngCOLimit: z.number("Required"),
});

export type SetSimLimitDto = z.infer<typeof setSimLimitSchema>;
