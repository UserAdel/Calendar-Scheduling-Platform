"use client";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import {
  DateValue,
  today,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
} from "@internationalized/date";
import { useRouter, useSearchParams } from "next/navigation";
interface iAppProps {
  availability: {
    day: string;
    isActive: boolean;
  }[];
}
export function RenderCalendar({ availability }: iAppProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const dateParams = searchParams.get("date");
    return dateParams ? parseDate(dateParams) : today(getLocalTimeZone());
  });
  useEffect(() => {
    const dataParam = searchParams.get("date");
    if (dataParam) {
      setDate(parseDate(dataParam));
    }
  }, [searchParams]);
  const handelDateChange = (date: DateValue) => {
    setDate(date as CalendarDate);
    const url = new URL(window.location.href);
    url.searchParams.set("date", date.toString());
    router.push(url.toString());
  };
  const isDateUnavailable = (date: DateValue) => {
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return !availability[adjustedIndex].isActive;
  };

  return (
    <Calendar
      minValue={today(getLocalTimeZone())}
      isDateUnavailable={isDateUnavailable}
      value={date}
      onChange={handelDateChange}
    />
  );
}
