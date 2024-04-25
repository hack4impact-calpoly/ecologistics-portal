"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from "../ui/custom/date-range-picker";
import { DebouncedInput } from "../ui/custom/debounced-input";
import { Label } from "../ui/label";
import TableColumnFilterDropdown from "../ui/custom/table-column-filter-dropdown";
import { columns } from "./columns";
import Reimbursement from "@/database/reimbursement-schema";
import { DateRange } from "react-day-picker";
import { dateFilterFn } from "@/lib/utils";
import { fuzzyFilter } from "@/lib/utils";
import CenteredSpinner from "@/components/centered-spinner";
import { DataTablePagination } from "@/components/data-table-pagination";

async function fetchReimbursements(): Promise<Reimbursement[]> {
  try {
    const response = await fetch("/api/reimbursement"); // Adjust endpoint as necessary
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default function AdminTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ recipientEmail: false });
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [reimbursements, setReimbursements] = React.useState<Reimbursement[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    fetchReimbursements()
      .then((data) => {
        setReimbursements(data);
        setIsLoading(false);
        console.log(reimbursements);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const table = useReactTable({
    data: reimbursements,
    columns,
    enableExpanding: true,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      expanded,
    },
    filterFns: {
      dateFilterFn,
      fuzzy: fuzzyFilter,
    },
  });

  const getUniqueValues = (data: any[], type: string) => {
    let values = new Set();
    data.map((d: any) => values.add(d[type]));

    return Array.from(values) as string[];
  };

  const handleDateRangeChange = (range: DateRange) => {
    table.getColumn("transactionDate")?.setFilterValue(() => {
      return [range.from, range.to];
    });
  };

  if (isLoading) {
    return (
      <div>
        <CenteredSpinner />
      </div>
    );
  }

  if (error) {
    return <div> Error: {error.message} </div>;
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between w-full mb-5">
        <div className="flex flex-col w-[25%]">
          <Label className="text-xs pl-1 flex-2">Search</Label>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 rounded flex-grow w-100 text-sm border border-block"
            placeholder="Search all columns..."
          />
        </div>
        <div className="flex flex-col w-[20%]">
          <TableColumnFilterDropdown
            table={table}
            identifier="organization"
            title="Organization"
            values={getUniqueValues(reimbursements, "organization")}
          />
        </div>
        <div className="flex flex-col w-[15%]">
          <TableColumnFilterDropdown
            table={table}
            identifier="paymentMethod"
            title="Preferred Payment"
            values={getUniqueValues(reimbursements, "paymentMethod")}
          />
        </div>
        <div className="flex flex-col w-[15%]">
          <TableColumnFilterDropdown
            table={table}
            identifier="status"
            title="Status"
            values={getUniqueValues(reimbursements, "status")}
          />
        </div>
        <div className="flex flex-col">
          <Label className="text-xs pl-1 min-w-[16rem]">Date Range</Label>
          <DatePickerWithRange
            className=""
            handleChange={handleDateRangeChange}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-left bg-neutral-200 text-black"
                      key={header.id}
                    >
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    row.toggleExpanded();
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-left" key={cell.id}>
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
      <DataTablePagination table={table} />
    </div>
  );
}
