import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import React from "react";
import { Table } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";

type TableColumnFilterDropdownProps = {
  table: Table<any>;
  title: string;
  identifier: string;
  values: string[];
};

const TableColumnFilterDropdown: React.FC<TableColumnFilterDropdownProps> = ({
  table,
  title,
  identifier,
  values,
}) => {
  return (
    <div className="flex flex-col w-full">
      <Label className="text-xs pl-1">{title}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full self-start">
          <Button variant="outline" className="flex justify-between">
            {(table?.getColumn(identifier)?.getFilterValue() as string) ??
              "All"}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => table.getColumn(identifier)?.setFilterValue("")}
          >
            All
          </DropdownMenuItem>
          {values.map((v) => {
            return (
              <DropdownMenuItem
                key={v}
                onClick={() => {
                  table?.getColumn(identifier)?.setFilterValue(v);
                }}
                className="capitalize"
              >
                {v}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableColumnFilterDropdown;
