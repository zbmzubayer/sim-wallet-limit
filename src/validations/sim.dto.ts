import { z } from "zod";

import { SIM_TRANSACTION_OPERATION } from "@/enums/sim.enum";

export const simBalanceSchema = z.object({
  operation: z.enum(SIM_TRANSACTION_OPERATION, "Required"),
  amount: z.number("Required"),
  charge: z.number("Required").default(0),
  note: z.string().max(255, "Note must be at most 255 characters").optional(),
});

export type SimBalanceDto = z.infer<typeof simBalanceSchema>;
