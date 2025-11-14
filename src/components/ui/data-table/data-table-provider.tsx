'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, useContext, useState } from 'react';

interface DataTableContextValues<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  columnLength: number;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const DataTableContext = createContext<DataTableContextValues<any> | null>(null);

interface DataTableProviderProps<TData, TValue> {
  children: React.ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialColumnFilters?: ColumnFiltersState;
}

export function DataTableProvider<TData, TValue>({
  children,
  columns,
  data,
  initialColumnFilters = [],
}: DataTableProviderProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  // const [isMounted, setIsMounted] = useState(false);

  // // Fix error on react table, when the table is not mounted
  // useLayoutEffect(() => {
  //   setIsMounted(true);
  // }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      // rowSelection,
      columnFilters,
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
  });

  // if (!isMounted) return null;

  return (
    <DataTableContext.Provider value={{ table, columnLength: columns.length }}>
      {children}
    </DataTableContext.Provider>
  );
}

export const useDataTable = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }

  return context;
};
