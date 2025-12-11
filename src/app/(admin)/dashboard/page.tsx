import { getAllChats } from "@/actions/chat.action";
import { getSimLimits } from "@/actions/sim.action";
import { ChatTable } from "@/components/chat/chat-table";
import type { ChatTableData } from "@/types/chat";

function transformData(chats: ChatTableData[]) {
  // sort data by bkBalance desc, ngBalance desc maintaining the chat and device relationship
  // for example: if a sim in device 2 in chat 1 has the highest balance, it should still be in device 2 and chat 1
  // but device 2 should be moved to the top of chat 1
  // and within device 2, the sims should be sorted by bkBalance desc, ngBalance desc
  // same goes for chat level
  // If a sim in certain device has the highest value, that chat should be moved to the top
  // Helper function to get the maximum balance between bkBalance and ngBalance
  const getMaxBalance = (sim: ChatTableData["chatDevices"][number]["device"]["sims"][number]) => {
    return Math.max(sim.bkBalance || 0, sim.ngBalance || 0);
  };

  return chats
    .map((chat) => {
      const sortedChatDevices = chat.chatDevices
        .map((cb) => {
          // Sort SIMs within each device by their maximum balance (descending)
          const sortedSims = [...cb.device.sims].sort((a, b) => {
            const maxBalanceA = getMaxBalance(a);
            const maxBalanceB = getMaxBalance(b);

            if (maxBalanceA !== maxBalanceB) {
              return maxBalanceB - maxBalanceA; // Descending order
            }

            // If max balances are equal, sort by bkBalance first, then ngBalance
            if (a.bkBalance !== b.bkBalance) {
              return b.bkBalance - a.bkBalance;
            }

            return b.ngBalance - a.ngBalance;
          });

          return {
            ...cb,
            device: {
              ...cb.device,
              sims: sortedSims,
              rowCount: sortedSims.length,
            },
          };
        })
        .sort((a, b) => {
          // Sort devices by their top SIM's maximum balance
          if (a.device.sims.length === 0) return 1;
          if (b.device.sims.length === 0) return -1;

          const maxBalanceA = getMaxBalance(a.device.sims[0]);
          const maxBalanceB = getMaxBalance(b.device.sims[0]);
          return maxBalanceB - maxBalanceA;
        });

      const chatRowCount = sortedChatDevices.reduce((sum, cb) => sum + cb.device.sims.length, 0);
      return {
        ...chat,
        chatDevices: sortedChatDevices,
        rowCount: chatRowCount,
      };
    })
    .sort((a, b) => {
      // Sort chats by their top device's top SIM's maximum balance
      if (a.chatDevices.length === 0 || a.chatDevices[0].device.sims.length === 0) return 1;
      if (b.chatDevices.length === 0 || b.chatDevices[0].device.sims.length === 0) return -1;

      const maxBalanceA = getMaxBalance(a.chatDevices[0].device.sims[0]);
      const maxBalanceB = getMaxBalance(b.chatDevices[0].device.sims[0]);
      return maxBalanceB - maxBalanceA;
    });
}

export type TransformChatData = ReturnType<typeof transformData>;

function getTotals(chats: ChatTableData[]) {
  const simSet = new Set<number>();
  let totalBkBalance = 0;
  let totalBK_SM = 0;
  let totalBK_CO = 0;
  let totalBK_MER = 0;
  let totalNgBalance = 0;
  let totalNG_SM = 0;
  let totalNG_CO = 0;
  let totalNG_MER = 0;

  chats.forEach((chat) => {
    chat.chatDevices.forEach((cb) => {
      cb.device.sims.forEach((sim) => {
        const simKey = sim.id;
        if (!simSet.has(simKey)) {
          simSet.add(simKey);
          totalBkBalance += sim.bkBalance > 0 ? sim.bkBalance : 0;
          totalNgBalance += sim.ngBalance > 0 ? sim.ngBalance : 0;
          totalBK_SM += sim.bkSM || 0;
          totalBK_CO += sim.bkCO || 0;
          totalBK_MER += sim.bkMER || 0;
          totalNG_SM += sim.ngSM || 0;
          totalNG_CO += sim.ngCO || 0;
          totalNG_MER += sim.ngMER || 0;
        }
      });
    });
  });

  return {
    totalBkBalance,
    totalBK_SM,
    totalBK_CO,
    totalBK_MER,
    totalNgBalance,
    totalNG_SM,
    totalNG_CO,
    totalNG_MER,
  };
}

export type Totals = ReturnType<typeof getTotals>;

export default async function DashboardPage() {
  const [chats, limits] = await Promise.all([getAllChats(), getSimLimits()]);
  const transformed = transformData(chats);
  const totals = getTotals(chats);

  return <ChatTable transformed={transformed} totals={totals} limits={limits} />;
}
