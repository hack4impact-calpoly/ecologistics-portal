"use client";

import CenteredSpinner from "@/components/centered-spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Organization } from "@/database/organization-schema";
import Reimbursement from "@/database/reimbursement-schema";
import Status from "@/lib/enum";
import { dateFilterFn, fuzzyFilter } from "@/lib/utils";
import { User } from "@clerk/nextjs/server";
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
import * as React from "react";
import { DateRange } from "react-day-picker";
import { TablePagination } from "../table-pagination";
import { DatePickerWithRange } from "../ui/custom/date-range-picker";
import { DebouncedInput } from "../ui/custom/debounced-input";
import TableColumnFilterDropdown from "../ui/custom/table-column-filter-dropdown";
import { Label } from "../ui/label";
import { columns } from "./columns";

export type ReimbursementWithOrganization = Reimbursement & {
  organization: string;
};

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

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`/api/user`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default function AdminTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({ recipientEmail: false });
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [reimbursements, setReimbursements] = React.useState<ReimbursementWithOrganization[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  // First render flag to determine number of rows that can fit without overflow
  // necessary for first render only
  const firstRender = React.useRef(true);
  const row = document.getElementById("admin-table-row")?.getBoundingClientRect();

  React.useEffect(() => {
    fetchReimbursements()
      .then(async (data) => {
        const users = await fetchUsers();
        console.log(users);
        return data.map((reimbursement) => {
          const user = users.find((user) => user.id === reimbursement.clerkUserId);
          return {
            ...reimbursement,
            organization: (user?.unsafeMetadata?.organization as Organization)?.name || "Unknown",
          };
        });
      })
      .then((reimbursements) => {
        setReimbursements(reimbursements);
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

  // Determine number of rows that can fit without overflow

  React.useEffect(() => {
    if (firstRender.current && row) {
      setPageSize(
        Math.floor((window.innerHeight - 348) / row.height) <= 0
          ? 3
          : Math.floor((window.innerHeight - 348) / row.height),
      );
      firstRender.current = false;
    }
    const handleWindowResize = () => {
      if (row) {
        setPageSize(
          Math.floor((window.innerHeight - 348) / row.height) <= 0
            ? 3
            : Math.floor((window.innerHeight - 348) / row.height),
        );
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [row, firstRender]);

  const getUniqueValues = (data: any[], type: string) => {
    let values = new Set();
    data.map((d: any) => values.add(d[type]));

    return Array.from(values) as string[];
  };

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

  if (isLoading) {
    return <CenteredSpinner />;
  }

  if (error) {
    return <div> Error: {error.message} </div>;
  }

  return (
    <>
      <ScrollArea className="mt-8 whitespace-nowrap">
        <div className="flex justify-between space-x-1 w-full mb-5 text-gray-400">
          <div className="flex flex-col w-[25%] min-w-[20rem]">
            <Label className="text-xs pl-1 flex-2">Search</Label>
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => {
                setGlobalFilter(String(value));
                setPageIndex(0);
              }}
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
              onFilterChange={() => setPageIndex(0)}
            />
          </div>
          <div className="flex flex-col w-[17%] min-w-[12rem]">
            <TableColumnFilterDropdown
              table={table}
              identifier="paymentMethod"
              title="Preferred Payment"
              values={getUniqueValues(reimbursements, "paymentMethod")}
              placeholder="Select Payment Type"
              onFilterChange={() => setPageIndex(0)}
            />
          </div>
          <div className="flex flex-col w-[17%] min-w-[12rem]">
            <TableColumnFilterDropdown
              table={table}
              identifier="status"
              title="Status"
              values={Object.values(Status)}
              placeholder="Select Status"
              onFilterChange={() => setPageIndex(0)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-xs pl-1 min-w-[16rem]">Date Range</Label>
            <DatePickerWithRange className="" handleChange={handleDateRangeChange} />
          </div>
        </div>
        <div id="admin-table-rows-div" className="flex max-h-[calc(100vh-300px)] rounded-md border">
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    id="admin-table-row"
                    onClick={() => {
                      row.toggleExpanded();
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="text-left [&_button_svg]:mx-5 [&_div]:items-left [&_div]:justify-start"
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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
