import { Suspense } from "react";

import { getAllChats } from "@/actions/chat.action";
import auth from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/header";
import { SimTransactionHistoryDialog } from "@/components/sim/sim-transaction-history-dialog";
import { UpdateSimBalanceDialog } from "@/components/sim/update-sim-balance-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/cn";
import type { ChatTableData } from "@/types/chat";

export default async function Home() {
  const session = await auth();

  return session?.user ? (
    <>
      <Header />
      <ChatTable />
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

async function ChatTable() {
  const chats = await getAllChats();
  const transformed = transformData(chats);

  return (
    <main className="container gap-2 py-5 max-h-[calc(100vh-4rem)] overflow-auto">
      {/* <UpdateSimBalanceForm /> */}
      <div className="overflow-hidden rounded-md border w-full">
        <Table>
          <TableHeader className="bg-blue-500">
            <TableRow className="*:border-x">
              <TableHead className="text-white">Chat / Group</TableHead>
              <TableHead className="text-white">Device No</TableHead>
              <TableHead className="text-white">Sim No</TableHead>
              <TableHead className="text-white">History</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">BK Balance</TableHead>
              <TableHead className="text-white">BK SM</TableHead>
              <TableHead className="text-white">BK CO</TableHead>
              <TableHead className="text-white">BK MER</TableHead>
              <TableHead className="text-white">NG Balance</TableHead>
              <TableHead className="text-white">NG SM</TableHead>
              <TableHead className="text-white">NG CO</TableHead>
              <TableHead className="text-white">NG MER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformed.length ? (
              transformed.map((chat) =>
                chat.devices.map((device, dIndex) =>
                  device.deviceSims.map((sim, sIndex) => (
                    <TableRow key={sim.id} className="hover:bg-muted/50">
                      {/* Chat title with rowspan */}
                      {dIndex === 0 && sIndex === 0 && (
                        <TableCell rowSpan={chat.rowCount}>{chat.title}</TableCell>
                      )}

                      {/* Device no with rowspan */}
                      {sIndex === 0 && (
                        <TableCell
                          rowSpan={device.rowCount}
                          style={{
                            borderColor: `var(--device-color-${device.deviceNo})`,
                            backgroundColor: `color-mix(in srgb, var(--device-color-${device.deviceNo}) 20%, transparent)`,
                          }}
                          className="border-l-4"
                        >
                          DS-{device.deviceNo}
                        </TableCell>
                      )}

                      {/* Sim info (always shown) */}
                      <TableCell
                        style={{ backgroundColor: `var(--sim-color-${sim.simNo})` }}
                        className="p-0"
                      >
                        <UpdateSimBalanceDialog
                          deviceNo={device.deviceNo}
                          simNo={sim.simNo}
                          phone={sim.sim.phone}
                          simId={sim.simId}
                          bkBalance={sim.sim.bkBalance}
                          ngBalance={sim.sim.ngBalance}
                        />
                      </TableCell>
                      <TableCell className="flex justify-center">
                        <SimTransactionHistoryDialog
                          deviceNo={device.deviceNo}
                          simNo={sim.simNo}
                          simId={sim.simId}
                          bkTotalSM={sim.sim.bkTotalSM}
                          bkTotalCO={sim.sim.bkTotalCO}
                          bkTotalMER={sim.sim.bkTotalMER}
                          ngTotalSM={sim.sim.ngTotalSM}
                          ngTotalCO={sim.sim.ngTotalCO}
                          ngTotalMER={sim.sim.ngTotalMER}
                        />
                      </TableCell>
                      <TableCell className="border-x">{sim.sim.phone}</TableCell>
                      <TableCell
                        className={cn(
                          "bg-green-100",
                          sim.sim.bkBalance > 5000 && "animate-caret-blink",
                        )}
                      >
                        {sim.sim.bkBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="border-x">{sim.sim.bkSM.toLocaleString()}</TableCell>
                      <TableCell className="border-x">{sim.sim.bkCO.toLocaleString()}</TableCell>
                      <TableCell className="border-x">{sim.sim.bkMER.toLocaleString()}</TableCell>
                      <TableCell
                        className={cn(
                          "bg-green-100",
                          sim.sim.ngBalance > 5000 && "animate-caret-blink",
                        )}
                      >
                        {sim.sim.ngBalance.toLocaleString()}
                      </TableCell>
                      <TableCell className="border-x">{sim.sim.ngSM.toLocaleString()}</TableCell>
                      <TableCell className="border-x">{sim.sim.ngCO.toLocaleString()}</TableCell>
                      <TableCell className="border-x">{sim.sim.ngMER.toLocaleString()}</TableCell>
                    </TableRow>
                  )),
                ),
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={13}
                  className="text-center py-10 font-medium text-muted-foreground"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
