import { EmptyState } from "@/app/_components/EmptyState";
import { SubmitButton } from "@/app/_components/SubmitButtons";
import { cancelMeetingAction } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";

async function getData(userId: string) {
  const UserData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,

      grantEmail: true,
    },
  });

  if (!UserData) {
    throw new Error("User Not Found");
  }
  const data = await nylas.events.list({
    identifier: UserData.grantId as string,
    queryParams: {
      calendarId: UserData.grantEmail as string,
    },
  });
  return data;
}

export default async function MeetingsRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  //   console.log(data.data[0].when);

  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No Meeting found"
          description="you don't have any meetings yet"
          buttonText="Create an new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming event which where booked with you and see the evnet
              type link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => (
              <form action={cancelMeetingAction} key={item.id}>
                <input type="hidden" name="eventId" value={item.id} />
                <div
                  className="grid grid-cols-3 justify-between items-center"
                  key={item.id} //
                >
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.startTime), "EEE,dd MMM")}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center mt-1">
                      <Video className="size-4 mr-2 text-primary" />{" "}
                      <a
                        // @ts-ignore
                        href={item.conferencing.details.url}
                        className="text-xs text-primary underline underline-offset-4 "
                        target="_blank"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                  <div className="flex  flex-col items-start">
                    <h2 className="text-sm font-medium ">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      you and {item.participants[0].name}{" "}
                    </p>
                  </div>
                  <SubmitButton
                    text="Cancel Event "
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
