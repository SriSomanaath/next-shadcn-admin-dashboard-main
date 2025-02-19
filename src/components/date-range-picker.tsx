"use client";

import * as React from "react";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format, startOfYear, endOfYear, eachDayOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly selectedRange?: DateRange | undefined;
  readonly onChangeRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  readonly calendarStart?: Date;
  readonly calendarEnd?: Date;
}

export function DateRangePicker({
  className,
  selectedRange,
  onChangeRange,
  calendarStart = startOfYear(new Date()), // Default: start of the current year
  calendarEnd = endOfYear(new Date()), // Default: end of the current year
}: DateRangePickerProps) {
  // Function to get all the dates between from and to in 'YYYY-MM-DD' format as a Set

  const renderDateText = () => {
    if (selectedRange?.from) {
      if (selectedRange.to) {
        return (
          <>
            {format(selectedRange.from, "LLL dd, y")} - {format(selectedRange.to, "LLL dd, y")}
          </>
        );
      }
      return format(selectedRange.from, "LLL dd, y");
    }
    return <span>Pick a date</span>;
  };

  return (
    <div className={cn("grid gap-2 ml-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full md:w-[245px] justify-start text-left font-normal",
              !selectedRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {renderDateText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={onChangeRange}
            numberOfMonths={2}
            disabled={{ before: calendarStart, after: calendarEnd }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


// "use client";

// import * as React from "react";

// import { CalendarIcon } from "@radix-ui/react-icons";
// import { format, startOfYear, endOfYear, eachDayOfInterval } from "date-fns";
// import { DateRange } from "react-day-picker";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";

// interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
//   readonly selectedRange?: DateRange | undefined;
//   readonly onChangeRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
//   readonly calendarStart?: Date;
//   readonly calendarEnd?: Date;
// }

// export function DateRangePicker({
//   className,
//   selectedRange,
//   onChangeRange,
//   calendarStart = startOfYear(new Date()), // Default: start of the current year
//   calendarEnd = endOfYear(new Date()), // Default: end of the current year
// }: DateRangePickerProps) {
//   // Function to get all the dates between from and to in 'YYYY-MM-DD' format as a Set
//   const getAllDatesInRange = (start: Date, end: Date) => {
//     const dates = eachDayOfInterval({ start, end });
//     // Using a Set to store unique date strings
//     return new Set(dates.map((date) => format(date, "yyyy-MM-dd")));
//   };

//   const renderDateText = () => {
//     if (selectedRange?.from) {
//       if (selectedRange.to) {
//         return (
//           <>
//             {format(selectedRange.from, "LLL dd, y")} - {format(selectedRange.to, "LLL dd, y")}
//           </>
//         );
//       }
//       return format(selectedRange.from, "LLL dd, y");
//     }
//     return <span>Pick a date</span>;
//   };

//   const handleDateSelection = (date: Date) => {
//     if (!selectedRange?.from || selectedRange.to) {
//       // If there's no first date selected or the second date exists, reset the range
//       onChangeRange({ from: date, to: undefined });
//     } else {
//       // If first date is selected, set second date (to)
//       if (date < selectedRange.from) {
//         // If the new date is earlier than the selected start, set it as the first date
//         onChangeRange({ from: date, to: selectedRange.from });
//       } else {
//         // Otherwise, treat the new date as the end date
//         onChangeRange({ from: selectedRange.from, to: date });
//       }
//     }
//   };

//   // If both from and to are selected, generate the list of dates in Set format
//   const selectedDatesSet = selectedRange?.from && selectedRange?.to 
//     ? getAllDatesInRange(selectedRange.from, selectedRange.to)
//     : new Set();

//   console.log("Selected dates set:", selectedDatesSet); // Logging the set of dates

//   return (
//     <div className={cn("grid gap-2 ml-1", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant="outline"
//             className={cn(
//               "w-full md:w-[245px] justify-start text-left font-normal",
//               !selectedRange && "text-muted-foreground",
//             )}
//           >
//             <CalendarIcon className="mr-2 size-4" />
//             {renderDateText()}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="end">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={selectedRange?.from}
//             selected={selectedRange}
//             onSelect={handleDateSelection} // Updated to handle date selection
//             numberOfMonths={2}
//             disabled={{ before: calendarStart, after: calendarEnd }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
