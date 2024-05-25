"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Button } from "@/components/ui/button";
import { DebouncedInput } from "../ui/custom/debounced-input";
import { useState } from "react";
import { DatePickerWithRange } from "../ui/custom/date-range-picker";
import { Label } from "@radix-ui/react-dropdown-menu";
import TableColumnFilterDropdown from "../ui/custom/table-column-filter-dropdown";
import { dateFilterFn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { rankItem } from "@tanstack/match-sorter-utils";
import React from "react";

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

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(6);
  const firstRender = React.useRef(true);
  const row = document
    .getElementById("sponsored-org-table-row")
    ?.getBoundingClientRect();

  React.useEffect(() => {
    if (firstRender.current && row) {
      setPageSize(
        Math.floor((window.innerHeight - 342) / row.height) <= 0
          ? 3
          : Math.floor((window.innerHeight - 342) / row.height),
      );
      firstRender.current = false;
    }
    const handleWindowResize = () => {
      if (row) {
        console.log(row.height);
        setPageSize(
          Math.floor((window.innerHeight - 342) / row.height) <= 0
            ? 3
            : Math.floor((window.innerHeight - 342) / row.height),
        );
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [row, firstRender]);

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

  const renderPagination = () => {
    let pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setPageIndex(i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return pages;
  };

  const handleDateRangeChange = (range: DateRange) => {
    table.getColumn("transactionDate")?.setFilterValue(() => {
      return [range.from, range.to];
    });
  };
  return (
    <>
      <ScrollArea className={` whitespace-nowrap`}>
        <div className="flex justify-between space-x-1 w-full py-4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="px-2 text-sm flex-grow w-100 mt-4 border rounded"
            placeholder="Search all columns..."
          />
          <TableColumnFilterDropdown
            table={table}
            identifier="status"
            title="Status"
            values={["Pending", "Declined", "On Hold", "Paid"]}
            placeholder=""
          />
          <div className="flex flex-col">
            <Label className="text-xs pl-1 min-w-[16rem]">Date Range</Label>
            <DatePickerWithRange
              handleChange={handleDateRangeChange}
              className="ml-2 self-end"
            />
          </div>
        </div>
        <div className="rounded-md border flex max-h-[calc(100dvh-250px)]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    id="sponsored-org-table-row"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Pagination>
        <PaginationContent>{renderPagination()}</PaginationContent>
      </Pagination>
    </>
  );
}
