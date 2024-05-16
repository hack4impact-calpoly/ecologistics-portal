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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(8);

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
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    filterFns: {
      dateFilterFn,
      fuzzy: fuzzyFilter,
    },
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
      <div className="w-screen h-screen">
        <CenteredSpinner />
      </div>
    );
  }

  if (error) {
    return <div> Error: {error.message} </div>;
  }

  return (
    <div className="w-full pl-2 pr-2">
      <div className="flex justify-between py-4 w-full">
        <div className="flex flex-col">
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
          values={getUniqueValues(reimbursements, "organization")}
        />
        <TableColumnFilterDropdown
          table={table}
          identifier="paymentMethod"
          title="Preferred Payment"
          values={getUniqueValues(reimbursements, "paymentMethod")}
        />
        <TableColumnFilterDropdown
          table={table}
          identifier="status"
          title="Status"
          values={getUniqueValues(reimbursements, "status")}
        />
        <div className="flex flex-col">
          <Label className="text-xs pl-3">Date Range</Label>
          <DatePickerWithRange
            className="ml-2 self-end"
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
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
      <Pagination>
        <PaginationContent>{renderPagination()}</PaginationContent>
      </Pagination>
    </div>
  );
}
