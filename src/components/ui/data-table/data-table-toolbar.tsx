import type { Table } from "@tanstack/react-table";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";

export interface FilterField {
  column: string;
  title: string;
  options: {
    label: React.ReactNode;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

import type { DateRange } from "react-day-picker";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterFields?: FilterField[];
}

export function DataTableToolbar<TData>({ table, filterFields }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => table.getColumn("note")?.setFilterValue(event.target.value)}
          placeholder="Search by amount, note"
          value={(table.getColumn("note")?.getFilterValue() as string) ?? ""}
        />

        {filterFields?.map(
          (field) =>
            table.getColumn(field.column) && (
              <DataTableFacetedFilter
                column={table.getColumn(field.column)}
                key={field.column}
                options={field.options}
                title={field.title}
              />
            ),
        )}
        <DateRangePicker
          className="h-8 w-56"
          onChange={(range) => {
            table.getColumn("createdAt")?.setFilterValue(range);
          }}
          rangeType="previous"
          value={table.getColumn("createdAt")?.getFilterValue() as DateRange}
        />
        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
            variant="ghost"
          >
            Reset
            <XIcon />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
