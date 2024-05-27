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

export const dateFilterFn = (row: any, columnId: string, value: [Date | undefined, Date | undefined]) => {
  const date = row.getValue(columnId);
  const [from, to] = value;
  const datePart = date.slice(0, 10);
  const fromPart = from?.toISOString().slice(0, 10);
  const toPart = to?.toISOString().slice(0, 10);

  if (!date) {
    return false;
  } else if (fromPart && toPart) {
    return datePart >= fromPart && datePart <= toPart;
  } else if (fromPart) {
    return datePart >= fromPart;
  } else if (toPart) {
    return datePart <= toPart;
  }
  return false;
};
