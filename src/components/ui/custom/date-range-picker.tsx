"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import "react-day-picker/dist/style.css";

type DatePickerWithRangeProps = {
  className?: string;
  handleChange: (dateRange: DateRange | undefined) => void;
};

export function DatePickerWithRange({
  className,
  handleChange,
}: DatePickerWithRangeProps) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const handleDayClick = (day: Date) => {
    if (!range?.from || range?.to) {
      setRange({ from: day, to: undefined });
      handleChange({ from: day, to: undefined });
    } else if (range.from && !range.to) {
      if (range.from.getTime() === day.getTime()) {
        setRange(undefined);
        handleChange(undefined);
      } else if (day > range.from) {
        setRange({ ...range, to: day });
        handleChange({ ...range, to: day });
      } else {
        setRange({ from: day, to: undefined });
        handleChange({ from: day, to: undefined });
      }
    }
  };

  return (
    <div className={cn("grid gap-2 w-full min-w-[16rem]", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !range && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} -{" "}
                  {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>Select Date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="range"
            selected={range}
            onDayClick={handleDayClick}
            numberOfMonths={2}
            defaultMonth={range?.from}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
