import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

interface TablePaginationProps {
  table: Table<any>;
  pageIndex: number;
  setPageIndex: (index: number) => void;
}

export const TablePagination: React.FunctionComponent<TablePaginationProps> = ({
  table,
  pageIndex,
  setPageIndex,
}) => (
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
);
