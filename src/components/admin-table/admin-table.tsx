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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

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
  const [pageSize, setPageSize] = React.useState(10);
  const [width, setWidth] = React.useState(0);

  // First render flag to determine number of rows that can fit without overflow
  // Necessary for when the div size changes, the pageSize state can remain consistent, preventing render bugs
  const firstRender = React.useRef(true);
  const div = document
    .getElementById("admin-table-rows-div")
    ?.getBoundingClientRect();
  const row = document
    .getElementById("admin-table-row")
    ?.getBoundingClientRect();

  React.useEffect(() => {
    fetchReimbursements()
      .then((data) => {
        setReimbursements(data);
        setIsLoading(false);
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
        pageSize,
        pageIndex,
      },
    },
    filterFns: {
      dateFilterFn,
      fuzzy: fuzzyFilter,
    },
  });

  // Determine number of rows that can fit without overflow, on first render
  React.useEffect(() => {
    if (div && row && firstRender.current) {
      setPageSize(Math.floor((div.height - 48) / row.height));
      firstRender.current = false;
    }
  }, [div, row]);

  window.addEventListener("resize", () => {
    setWidth(Math.floor(window.innerWidth - 136));
  });
  window.removeEventListener("resize", () => {
    setWidth(Math.floor(window.innerWidth - 136));
  });

  React.useEffect(() => {
    setWidth(Math.floor(window.innerWidth - 136));
  }, []);

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
    return <CenteredSpinner />;
  }

  if (error) {
    return <div> Error: {error.message} </div>;
  }

  return (
    <>
      <ScrollArea
        className={`h-[81vh] whitespace-nowrap`}
        style={{ width: width }}
      >
        <div className=" flex flex-col">
          <div className="flex justify-between space-x-1 w-full mb-5 text-gray-400">
            <div className="flex flex-col w-[25%] min-w-[20rem]">
              <Label className="text-xs pl-1 flex-2">Search</Label>
              <DebouncedInput
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(String(value))}
                className="p-2 rounded flex-grow w-100 text-sm border border-block"
                placeholder="Search all columns..."
              />
            </div>
            <div className="flex flex-col w-[20%] min-w-[16rem] text-ellipsis	">
              <TableColumnFilterDropdown
                table={table}
                identifier="organization"
                title="Organization"
                values={getUniqueValues(reimbursements, "organization")}
                placeholder="All"
              />
            </div>
            <div className="flex flex-col w-[17%] min-w-[12rem]">
              <TableColumnFilterDropdown
                table={table}
                identifier="paymentMethod"
                title="Preferred Payment"
                values={getUniqueValues(reimbursements, "paymentMethod")}
                placeholder="Select Payment Type"
              />
            </div>
            <div className="flex flex-col w-[17%] min-w-[12rem]">
              <TableColumnFilterDropdown
                table={table}
                identifier="status"
                title="Status"
                values={getUniqueValues(reimbursements, "status")}
                placeholder="Select Status"
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
          <div
            id="admin-table-rows-div"
            className="flex max-h-[68vh] rounded-md border"
          >
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
                      id="admin-table-row"
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

          {/* Table pagination Stuff*/}
          <div className="flex justify-center">
            <div className="flex  space-x-6 lg:space-x-8 pt-2 content-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => {
                    table.setPageIndex(0);
                    setPageIndex(0);
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    table.previousPage();
                    setPageIndex(pageIndex - 1);
                  }}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {pageIndex + 1} of {table.getPageCount()}
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    table.nextPage();
                    setPageIndex(pageIndex + 1);
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => {
                    table.setPageIndex(table.getPageCount() - 1);
                    setPageIndex(table.getPageCount() - 1);
                  }}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
