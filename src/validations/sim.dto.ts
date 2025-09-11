import { z } from "zod";

import { SIM_TRANSACTION_OPERATION } from "@/enums/sim.enum";

export const simBalanceSchema = z.object({
  operation: z.enum(SIM_TRANSACTION_OPERATION),
  amount: z.number().min(1),
  charge: z.number().min(0).default(0),
});

export type SimBalanceDto = z.infer<typeof simBalanceSchema>;
