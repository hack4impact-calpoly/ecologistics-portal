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
import { Label } from "@radix-ui/react-dropdown-menu";
import TableColumnFilterDropdown from "../ui/table-column-filter-dropdown";
import { columns } from "./column-def";
import { data } from "./fake-data";
import Link from "next/link";

export default function ReimbursementRequestsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ recipientEmail: false });
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    enableExpanding: true,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
  });

  const getUniqueValues = (data: any[], type: string) => {
    let values = new Set();
    data.map((d: any) => values.add(d[type]));

    return Array.from(values) as string[];
  };

  return (
    <div className="w-full pl-2 pr-2">
      <div className="flex justify-between py-4 w-full">
        <div>
          <Label className="text-xs pl-1 flex-2">Search</Label>
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 rounded flex-grow w-100 text-sm border border-block"
            placeholder="Search all columns..."
          />
        </div>
        <TableColumnFilterDropdown
          table={table}
          identifier="organization"
          title="Organization"
          values={getUniqueValues(data, "organization")}
        />
        <TableColumnFilterDropdown
          table={table}
          identifier="paymentMethod"
          title="Preferred Payment"
          values={getUniqueValues(data, "paymentMethod")}
        />
        <TableColumnFilterDropdown
          table={table}
          identifier="status"
          title="Status"
          values={getUniqueValues(data, "status")}
        />
        <div>
          <Label className="text-xs pl-3">Date Range</Label>
          <DatePickerWithRange className="ml-2 self-end" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-center" key={header.id}>
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
              table.getRowModel().rows.map((row, i) => (
                <>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      console.log("clicked");
                      row.toggleExpanded();
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="text-center" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* EXPANDED section -- hard-coded for now */}
                  {row.getIsExpanded() ? (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div>Payment Type Info: </div>
                        <div>
                          Email Address: {row.getValue("recipientEmail")}
                        </div>
                        <div>Billing Type: </div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>Venmo user was not provided</TableCell>
                      <TableCell>
                        <div>
                          <Link href="">receipt.pdf </Link>
                        </div>
                        <div>
                          <Link href="">receipt.pdf </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
