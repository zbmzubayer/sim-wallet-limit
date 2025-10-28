import { Suspense } from "react";

import { getAllChats } from "@/actions/chat.action";
import auth from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { ChatTable } from "@/components/chat/chat-table";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { ChatTableData } from "@/types/chat";

export default async function Home() {
  const session = await auth();

  return session?.user ? (
    <>
      <Header />
      <ChatData />
    </>
  ) : (
    <main className="container flex h-screen flex-col items-center justify-center gap-2">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-xl uppercase tracking-wider">Admin Panel</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<Spinner className="flex h-full w-full items-center justify-center" />}
          >
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

function transformData(chats: ChatTableData[]) {
  // sort data by bkBalance desc, ngBalance desc maintaining the chat and device relationship
  // for example: if a sim in device 2 in chat 1 has the highest balance, it should still be in device 2 and chat 1
  // but device 2 should be moved to the top of chat 1
  // and within device 2, the sims should be sorted by bkBalance desc, ngBalance desc
  // same goes for chat level
  // If a sim in certain device has the highest value, that chat should be moved to the top
  // Helper function to get the maximum balance between bkBalance and ngBalance
  const getMaxBalance = (deviceSim: ChatTableData["devices"][number]["deviceSims"][number]) => {
    return Math.max(deviceSim.sim.bkBalance || 0, deviceSim.sim.ngBalance || 0);
  };

  return chats
    .map((chat) => {
      const sortedDevices = chat.devices
        .map((device) => {
          // Sort SIMs within each device by their maximum balance (descending)
          const sortedSims = [...device.deviceSims].sort((a, b) => {
            const maxBalanceA = getMaxBalance(a);
            const maxBalanceB = getMaxBalance(b);

            if (maxBalanceA !== maxBalanceB) {
              return maxBalanceB - maxBalanceA; // Descending order
            }

            // If max balances are equal, sort by bkBalance first, then ngBalance
            if (a.sim.bkBalance !== b.sim.bkBalance) {
              return b.sim.bkBalance - a.sim.bkBalance;
            }

            return b.sim.ngBalance - a.sim.ngBalance;
          });

          return {
            ...device,
            deviceSims: sortedSims,
            rowCount: sortedSims.length,
          };
        })
        .sort((a, b) => {
          // Sort devices by their top SIM's maximum balance
          if (a.deviceSims.length === 0) return 1;
          if (b.deviceSims.length === 0) return -1;

          const maxBalanceA = getMaxBalance(a.deviceSims[0]);
          const maxBalanceB = getMaxBalance(b.deviceSims[0]);
          return maxBalanceB - maxBalanceA;
        });

      const chatRowCount = sortedDevices.reduce((sum, device) => sum + device.deviceSims.length, 0);

      return {
        ...chat,
        devices: sortedDevices,
        rowCount: chatRowCount,
      };
    })
    .sort((a, b) => {
      // Sort chats by their top device's top SIM's maximum balance
      if (a.devices.length === 0 || a.devices[0].deviceSims.length === 0) return 1;
      if (b.devices.length === 0 || b.devices[0].deviceSims.length === 0) return -1;

      const maxBalanceA = getMaxBalance(a.devices[0].deviceSims[0]);
      const maxBalanceB = getMaxBalance(b.devices[0].deviceSims[0]);
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
    chat.devices.forEach((device) => {
      device.deviceSims.forEach((sim) => {
        const simKey = sim.simId;
        if (!simSet.has(simKey)) {
          simSet.add(simKey);
          totalBkBalance += sim.sim.bkBalance > 0 ? sim.sim.bkBalance : 0;
          totalNgBalance += sim.sim.ngBalance > 0 ? sim.sim.ngBalance : 0;
          totalBK_SM += sim.sim.bkSM || 0;
          totalBK_CO += sim.sim.bkCO || 0;
          totalBK_MER += sim.sim.bkMER || 0;
          totalNG_SM += sim.sim.ngSM || 0;
          totalNG_CO += sim.sim.ngCO || 0;
          totalNG_MER += sim.sim.ngMER || 0;
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

async function ChatData() {
  const chats = await getAllChats();
  const transformed = transformData(chats);
  const totals = getTotals(chats);

  return (
    <main className="container gap-2 py-5 max-h-[calc(100vh-4rem)] overflow-auto">
      <ChatTable transformed={transformed} totals={totals} />
    </main>
  );
}
