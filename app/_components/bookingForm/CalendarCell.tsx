import { useRef } from "react";
import {
  DateValue,
  mergeProps,
  useCalendarCell,
  useFocusRing,
} from "react-aria";
import { CalendarState } from "react-stately";
import { CalendarDate, isSameMonth, isToday } from "@internationalized/date";
import { cn } from "@/lib/utils";
export function CalendarCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: (date: DateValue) => boolean;
}) {
  let ref = useRef(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const isDayToday = isToday(date, state.timeZone);
  const isOutsideOfMonth = !isSameMonth(currentMonth, date);
  const finallyIsDisabled = isDisabled || isUnavailable;
  return (
    <td
      {...cellProps}
      className={`py-0.5 px-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        ref={ref}
        hidden={isOutsideOfMonth}
        {...mergeProps(buttonProps, focusProps)}
        className="size-10 sm:size-12 outline-none group rounded-md  "
      >
        <div
          className={cn(
            "size-full rounded-sm flex items-center justify-center text-sm font-medium ",
            isSelected ? "bg-primary text-primary-foreground" : "",
            finallyIsDisabled ? "text-muted-foreground cursor-not-allowed" : "",
            !finallyIsDisabled && !isSelected
              ? "cursor-pointer bg-secondary"
              : ""
            // isOutsideVisibleRange ? "text-muted-foreground" : ""

            // isUnavailable ? "text-muted-foreground" : "",
          )}
        >
          {formattedDate}
          {isDayToday && (
            <div
              className={cn(
                "absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary",
                isSelected && "bg-white"
              )}
            />
          )}
        </div>
      </div>
    </td>
  );
}
