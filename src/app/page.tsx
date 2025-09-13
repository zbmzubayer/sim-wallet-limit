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
import type { ChatTableData } from "@/types/chat";

function transformData(chats: ChatTableData[]) {
  return chats.map((chat) => {
    // total rows = sum of all sims in all devices
    const chatRowCount = chat.devices.reduce((sum, device) => sum + device.deviceSims.length, 0);

    return {
      ...chat,
      rowCount: chatRowCount,
      devices: chat.devices.map((device) => ({
        ...device,
        rowCount: device.deviceSims.length,
      })),
    };
  });
}

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
            {transformed.map((chat) =>
              chat.devices.map((device, dIndex) =>
                device.deviceSims.map((sim, sIndex) => (
                  <TableRow key={sim.id}>
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
                        bkTotalSM={sim.sim.bkSM}
                        bkTotalCO={sim.sim.bkCO}
                        bkTotalMER={sim.sim.bkMER}
                        ngTotalSM={sim.sim.ngSM}
                        ngTotalCO={sim.sim.ngCO}
                        ngTotalMER={sim.sim.ngMER}
                      />
                    </TableCell>
                    <TableCell className="border-x">{sim.sim.phone}</TableCell>
                    <TableCell className="bg-green-100">{sim.sim.bkBalance}</TableCell>
                    <TableCell className="border-x">{sim.sim.bkSM}</TableCell>
                    <TableCell className="border-x">{sim.sim.bkCO}</TableCell>
                    <TableCell className="border-x">{sim.sim.bkMER}</TableCell>
                    <TableCell className="bg-green-100">{sim.sim.ngBalance}</TableCell>
                    <TableCell className="border-x">{sim.sim.ngSM}</TableCell>
                    <TableCell className="border-x">{sim.sim.ngCO}</TableCell>
                    <TableCell className="border-x">{sim.sim.ngMER}</TableCell>
                  </TableRow>
                )),
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
