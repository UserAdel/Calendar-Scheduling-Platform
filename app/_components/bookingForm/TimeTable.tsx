import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Day } from "@/lib/generated/prisma";
import { requireUser } from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import Link from "next/link";
import { GetFreeBusyResponse, NylasResponse } from "nylas";

async function getData(userName: string, selectedDate: Date) {
  const currentDay = format(selectedDate, "EEEE");
  console.log("Selected day:", currentDay, "| user:", userName);

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch the active availability for the selected day and user
  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Day,
      isActive: true,
      User: {
        userName: userName,
      },
    },
    select: {
      formTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  console.log("Availability data:", data);

  // Diagnostic: list all availability rows for this user to debug mismatches
  try {
    const allForUser = await prisma.availability.findMany({
      where: { User: { userName } },
      select: {
        id: true,
        day: true,
        formTime: true,
        tillTime: true,
        isActive: true,
      },
      // orderBy: { day: "asc" },
    });
    // console.log("All availability for user:", allForUser);
  } catch (e) {
    console.log("Failed to fetch all availability for user", e);
  }

  // Only fetch Nylas data if we have availability data and user has grantId/grantEmail
  let nylasCalendarData = null;
  if (data?.User?.grantId && data?.User?.grantEmail) {
    try {
      nylasCalendarData = await nylas.calendars.getFreeBusy({
        identifier: data.User.grantId,
        requestBody: {
          startTime: Math.floor(startOfDay.getTime() / 1000),
          endTime: Math.floor(endOfDay.getTime() / 1000),
          emails: [data.User.grantEmail],
        },
      });
    } catch (error) {
      console.error("Error fetching Nylas calendar data:", error);
    }
  } else {
    console.log("No availability data or missing grantId/grantEmail for user");
  }

  return {
    data,
    nylasCalendarData,
  };
}

interface iAppProp {
  selectedDate: Date;
  userName: string;
  duration: number;
}

function caluculateAvailableTimeSlots(
  date: string,
  dbAvailabilty: { formTime: string | undefined; tillTime: string | undefined },
  nylasDate: NylasResponse<GetFreeBusyResponse[]> | null,
  duration: number
) {
  const now = new Date();
  // Guard: require valid availability window
  if (!dbAvailabilty.formTime || !dbAvailabilty.tillTime) {
    return [] as string[];
  }
  const availableFrom = parse(
    `${date} ${dbAvailabilty.formTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  const availableTill = parse(
    `${date} ${dbAvailabilty.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  // Guard: ensure parsed dates are valid
  if (isNaN(availableFrom.getTime()) || isNaN(availableTill.getTime())) {
    return [] as string[];
  }
  // Safely read busy slots from Nylas; support both camelCase and snake_case
  const first = (nylasDate as any)?.data?.[0] ?? null;
  const rawSlots: any[] = (first?.timeSlots ??
    first?.timeSlot ??
    first?.time_slots ??
    []) as any[];
  const busySlots = rawSlots.map((slot: any) => ({
    start: fromUnixTime(slot.startTime ?? slot.start_time),
    end: fromUnixTime(slot.endTime ?? slot.end_time),
  }));
  const allSlots = [];
  let currentSlot = availableFrom;
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }
  const freeSlote = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy: { start: any; end: any }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });
  return freeSlote.map((slot) => format(slot, "HH:mm"));
}
export async function TimeTable({
  selectedDate,
  userName,
  duration,
}: iAppProp) {
  console.log(selectedDate);
  const { data, nylasCalendarData } = await getData(userName, selectedDate);
  const formatedDate = format(selectedDate, "yyyy-MM-dd");
  const dbAvailabilty = { formTime: data?.formTime, tillTime: data?.tillTime };
  const availableSlots = caluculateAvailableTimeSlots(
    formatedDate,
    dbAvailabilty,
    nylasCalendarData as NylasResponse<GetFreeBusyResponse[]>,
    duration
  );
  console.log(nylasCalendarData);
  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>
      <div className="mt-3 max-h-[350px] overflow-y-auto">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
              key={index}
            >
              <Button className="w-full mb-2" variant="outline">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>No available slots</p>
        )}
      </div>
    </div>
  );
}
