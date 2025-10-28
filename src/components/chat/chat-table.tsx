"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckIcon, FilterIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { getAllDevices } from "@/actions/sim.action";
import type { Totals, TransformChatData } from "@/app/page";
import { SimTransactionHistoryDialog } from "@/components/sim/sim-transaction-history-dialog";
import { UpdateSimBalanceDialog } from "@/components/sim/update-sim-balance-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/cn";

interface ChatTableProps {
  transformed: TransformChatData;
  totals: Totals;
}

export function ChatTable({ transformed, totals }: ChatTableProps) {
  const { data } = useQuery({
    queryKey: ["devices"],
    queryFn: getAllDevices,
  });

  const [selectedValues, setSelectedValues] = useState<number[]>([]);

  // Only show devices that are selected in the filter
  const filteredDevices = useMemo(() => {
    if (selectedValues.length === 0) {
      return transformed;
    }
    return transformed
      .map((chat) => {
        const filteredDeviceSims = chat.devices
          .filter((device) => selectedValues.includes(device.id))
          .map((device) => device);
        return { ...chat, devices: filteredDeviceSims };
      })
      .filter((chat) => chat.devices.length > 0);
  }, [selectedValues, transformed]);

  return (
    <>
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-8 border-dashed" size="sm" variant="outline">
              <FilterIcon />
              Filter by Device
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search devices..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {data?.map((item) => {
                    const isSelected = selectedValues.includes(item.id);
                    return (
                      <CommandItem
                        key={item.deviceNo}
                        onSelect={() => {
                          if (isSelected) {
                            setSelectedValues((prev) => prev.filter((v) => v !== item.id));
                          } else {
                            setSelectedValues((prev) => [...prev, item.id]);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 inline-flex size-4 items-center justify-center rounded border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <CheckIcon className="size-4 text-primary-foreground" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span>DS-{item.deviceNo}</span>
                          <span className="text-muted-foreground text-xs">({item.chat.title})</span>
                        </div>
                      </CommandItem>
                    );
                  })}
                  {selectedValues.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup>
                        <CommandItem
                          className="justify-center text-center"
                          onSelect={() => setSelectedValues([])}
                        >
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex items-center gap-2 tabular-nums text-xs">
          <div className="rounded-md border-2 px-2 py-1">
            BK Balance: {totals.totalBkBalance.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            BK SM: {totals.totalBK_SM.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            BK CO: {totals.totalBK_CO.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            BK MER: {totals.totalBK_MER.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            NG Balance: {totals.totalNgBalance.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            NG SM: {totals.totalNG_SM.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            NG CO: {totals.totalNG_CO.toLocaleString()}
          </div>
          <div className="rounded-md border-2 px-2 py-1">
            NG MER: {totals.totalNG_MER.toLocaleString()}
          </div>
        </div>
      </div>
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
            {filteredDevices.length ? (
              filteredDevices.map((chat) =>
                chat.devices.map((device, dIndex) =>
                  device.deviceSims.map((sim, sIndex) => (
                    <TableRow
                      key={sim.id}
                      className={cn(
                        "hover:bg-muted/50",
                        sIndex === device.deviceSims.length - 1 && "border-b border-black",
                      )}
                    >
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
    </>
  );
}
