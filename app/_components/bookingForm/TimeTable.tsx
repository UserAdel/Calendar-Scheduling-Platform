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
import { GetFreeBusyResponse, NylasResponse } from "nylas";

async function getData(userName: string, selectedDate: Date) {
  const currentDay = format(selectedDate, "EEEE");
  console.log("Selected day:", currentDay);

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Day,
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
}

function caluculateAvailableTimeSlots(
  date: string,
  dbAvailabilty: { formTime: string | undefined; tillTime: string | undefined },
  nylasDate: NylasResponse<GetFreeBusyResponse[]>,
  duration: number
) {
  const now = new Date();
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
  const busySlots = nylasDate.data[0].timeSlot.map((slot) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
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
export async function TimeTable({ selectedDate, userName }: iAppProp) {
  console.log(selectedDate);
  const { data, nylasCalendarData } = await getData(userName, selectedDate);
  const formatedDate = format(selectedDate, "yyyy-MM-dd");
  const dbAvailabilty = { formTime: data?.formTime, tillTime: data?.tillTime };
  const availableSlots = caluculateAvailableTimeSlots(
    formatedDate,
    dbAvailabilty,
    nylasCalendarData as NylasResponse<GetFreeBusyResponse[]>,
    30
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
      <div className="mt-3 max-h-[350px] ">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot) => <p>{slot}</p>)
        ) : (
          <p>No available slots</p>
        )}
      </div>
    </div>
  );
}
