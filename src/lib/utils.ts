import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export const dateFilterFn = (
  row: any,
  columnId: string,
  value: [Date | undefined, Date | undefined],
) => {
  const date = row.getValue(columnId);
  const [from, to] = value;
  if (!date) {
    return false;
  } else if (from && to) {
    return date >= from && date <= to;
  } else if (from) {
    return date >= from;
  } else if (to) {
    return date <= to;
  }
  return false;
};
