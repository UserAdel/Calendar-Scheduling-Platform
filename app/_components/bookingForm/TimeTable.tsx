import { prisma } from "@/lib/db";
import { Day } from "@/lib/generated/prisma";
import { requireUser } from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import { format } from "date-fns";

async function getData(userName: string, selectedDate: Date) {
  const currentDay = format(selectedDate, "EEEE");
  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);
  await requireUser();
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

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.User.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.User.grantEmail as string],
    },
  });
  return {
    data,
    nylasCalendarData,
  };
}

interface iAppProp {
  selectedDate: Date;
  userName: string;
}

export async function TimeTable({ selectedDate, userName }: iAppProp) {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);
  console.log(nylasCalendarData);
  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>
    </div>
  );
}
