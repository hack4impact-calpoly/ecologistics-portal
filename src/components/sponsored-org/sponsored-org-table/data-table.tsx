"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Status from "@/lib/enum";
import { dateFilterFn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { rankItem } from "@tanstack/match-sorter-utils";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import { TablePagination } from "../../table-pagination";
import { DatePickerWithRange } from "../../ui/custom/date-range-picker";
import { DebouncedInput } from "../../ui/custom/debounced-input";
import TableColumnFilterDropdown from "../../ui/custom/table-column-filter-dropdown";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(3);

  const handleWindowResize = () => {
    const row = document.getElementById("sponsored-org-table-row")?.getBoundingClientRect();
    if (row) {
      setPageSize(
        Math.floor((window.innerHeight - 440) / row.height) <= 0
          ? 3
          : Math.floor((window.innerHeight - 440) / row.height),
      );
    }
  };

  React.useEffect(() => {
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    filterFns: {
      dateFilterFn,
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  });

  const pageCount = table.getPageCount();

  const handleDateRangeChange = (range?: DateRange) => {
    if (range) {
      table.getColumn("transactionDate")?.setFilterValue(() => {
        return [range.from, range.to];
      });
    } else {
      table.getColumn("transactionDate")?.setFilterValue(() => {
        return undefined;
      });
    }
    setPageIndex(0);
  };
  return (
    <>
      <ScrollArea className="mt-8 whitespace-nowrap">
        <div className="flex justify-between w-full py-4 text-gray-400">
          <div className="flex">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => {
                setGlobalFilter(String(value));
                setPageIndex(0);
              }}
              className="px-2 text-sm flex-grow w-100 mt-4 border rounded"
              placeholder="Search all columns..."
            />
          </div>
          <div className="flex space-x-2 pl-3">
            <div className="w-40">
              <TableColumnFilterDropdown
                table={table}
                identifier="status"
                title="Status"
                values={Object.values(Status)}
                placeholder="All"
                onFilterChange={() => setPageIndex(0)}
              />
            </div>
            <div>
              <Label className="text-xs">Date Range</Label>
              <DatePickerWithRange handleChange={handleDateRangeChange} className="" />
            </div>
          </div>
        </div>
        <div className="rounded-md border flex max-h-[calc(100dvh-330px)]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-left bg-neutral-200 text-black" key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow id="sponsored-org-table-row" key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TablePagination table={table} pageIndex={pageIndex} setPageIndex={setPageIndex} />
    </>
  );
}
