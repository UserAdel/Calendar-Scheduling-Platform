"use client";
import { CalendarProps, DateValue, useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { CalenderHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

export function Calendar(
  props: CalendarProps<DateValue> & {
    isDateUnavailable?: (date: DateValue) => boolean;
  }
) {
  const { locale } = useLocale();
  let state = useCalendarState({
    createCalendar,
    ...props,
    locale,
    visibleDuration: { months: 1 },
  });
  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  return (
    <div {...calendarProps} className="inline-block">
      <CalenderHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-8 ">
        <CalendarGrid
          state={state}
          isDateUnavailable={props.isDateUnavailable}
        />
      </div>
    </div>
  );
}
