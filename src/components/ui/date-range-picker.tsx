"use client";

import { addMonths, addWeeks, addYears, subDays, subMonths, subWeeks } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";

const today = new Date();
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

// const next7Days = {
//   from: today,
//   to: addDays(today, 6),
// };
// const next30Days = {
//   from: today,
//   to: addDays(today, 30),
// };
// const nextMonth = {
//   from: today,
//   to: addMonths(today, 1),
// };
// const next3months = {
//   from: today,
//   to: addMonths(today, 3),
// };
// const next6months = {
//   from: today,
//   to: addMonths(today, 6),
// };
// const nextYear = {
//   from: today,
//   to: addYears(today, 1),
// };

const dateRanges = {
  next: [
    { label: "Today", range: { from: today, to: today } },
    { label: "Next week", range: { from: today, to: addWeeks(today, 1) } },
    // { label: 'Next 30 days', range: { from: today, to: addDays(today, 30) } },
    { label: "Next month", range: { from: today, to: addMonths(today, 1) } },
    { label: "Next 3 months", range: { from: today, to: addMonths(today, 3) } },
    { label: "Next 6 months", range: { from: today, to: addMonths(today, 6) } },
    { label: "Next year", range: { from: today, to: addYears(today, 1) } },
  ],
  previous: [
    { label: "Today", range: { from: todayStart, to: today } },
    { label: "Yesterday", range: { from: subDays(todayStart, 1), to: todayStart } },
    { label: "Last week", range: { from: subWeeks(todayStart, 1), to: today } },
    // { label: 'Last 30 days', range: { from: subDays(today, 30), to: today } },
    { label: "Last month", range: { from: subMonths(todayStart, 1), to: today } },
    // { label: "Last 3 months", range: { from: subMonths(today, 3), to: today } },
    // { label: "Last 6 months", range: { from: subMonths(today, 6), to: today } },
    // { label: "Last year", range: { from: subYears(today, 1), to: today } },
  ],
} as const;

interface DatePickerProps {
  rangeType?: keyof typeof dateRanges;
  className?: string;
  value?: DateRange;
  onChange: (date?: DateRange) => void;
}

export function DateRangePicker({
  rangeType = "next",
  className,
  value,
  onChange,
}: DatePickerProps) {
  const [month, setMonth] = useState(today);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={cn("w-full justify-between font-normal", className)} variant="outline">
          {value?.from && value?.to
            ? `${value.from?.toLocaleDateString()} - ${value.to?.toLocaleDateString()}`
            : "Select date range"}
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0" side="top">
        <div className="flex flex-col-reverse sm:flex-row">
          <div className="flex flex-col p-2 max-sm:border-t sm:border-r">
            {dateRanges[rangeType].map((item) => (
              <Button
                className="w-full justify-start font-normal"
                key={item.label}
                onClick={() => {
                  onChange(item.range);
                  setMonth(item.range.to);
                }}
                size="sm"
                variant="ghost"
              >
                {item.label}
              </Button>
            ))}
            {/* <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next7Days);
                setMonth(next7Days.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 7 days
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next30Days);
                setMonth(next30Days.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 30 days
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(nextMonth);
                setMonth(nextMonth.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next month
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next3months);
                setMonth(next3months.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 3 months
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(next6months);
                setMonth(next6months.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next 6 months
            </Button>
            <Button
              className="w-full justify-start font-normal"
              onClick={() => {
                onChange(nextYear);
                setMonth(nextYear.to);
              }}
              size="sm"
              variant="ghost"
            >
              Next year
            </Button> */}
          </div>
          <Calendar
            className="p-2"
            // disabled={[
            //   { before: today }, // Dates before today
            // ]}
            mode="range"
            month={month}
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                const newDate = {
                  from: selectedDate.from ? new Date(selectedDate.from) : undefined,
                  to: selectedDate.to ? new Date(selectedDate.to) : undefined,
                };
                if (newDate.from) newDate.from.setHours(0, 0, 0, 0);
                if (newDate.to) newDate.to.setHours(23, 59, 59, 999);
                onChange(newDate);
              }
            }}
            selected={value}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
