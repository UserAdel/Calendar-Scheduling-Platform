import { RenderCalendar } from "@/app/_components/bookingForm/RenderCalendar";
import { TimeTable } from "@/app/_components/bookingForm/TimeTable";
import { SubmitButton } from "@/app/_components/SubmitButtons";
import { CreateMeetingAction } from "@/app/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/db";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";

// TODO Improve Security
async function getData(eventUrl: string, userName: string) {
  try {
    const data = await prisma.eventType.findFirst({
      where: {
        url: eventUrl,
        User: {
          userName: userName,
        },
        active: true,
      },
      select: {
        id: true,
        description: true,
        title: true,
        duration: true,
        videoCallSoftware: true,
        User: {
          select: {
            image: true,
            name: true,
            availability: {
              select: {
                day: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      // console.log(eventUrl, userName);
      return notFound();
    }
    // console.log(data);
    return data;
  } catch (err) {
    console.error("Failed to fetch booking page data", {
      eventUrl,
      userName,
      err,
    });
    throw err; // Let the error surface instead of masking as 404
  }
}

export default async function BookingFromRoute({
  params,
  searchParams,
}: {
  params: Promise<{
    username: string;
    eventUrl: string;
  }>;
  searchParams: Promise<{
    date?: string;
    time?: string;
  }>;
}) {
  const { username, eventUrl } = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getData(eventUrl, username);
  const selectedDate = resolvedSearchParams.date
    ? new Date(resolvedSearchParams.date)
    : new Date();
  const FormatedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);
  const showForm = !!(await searchParams).date && !!(await searchParams).time;
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      {showForm ? (
        <Card className="max-w-[600px] w-full ">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr] gap-4 ">
            <div>
              <img
                src={data.User.image as string}
                alt="Profile Image of user"
                className="size-10 rounded-full "
              />
              <p className="text-sm font-medium text-muted-foreground mt-1 ">
                {data.User?.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
              <p className="text-sm font-medium text-muted-foreground ">
                {data.description}
              </p>
              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground ">
                    {FormatedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground ">
                    {data.duration} Minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <VideoIcon className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground ">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-full w-[1px]" />

            <form
              className="flex flex-col gap-y-4"
              action={CreateMeetingAction}
            >
              <input
                type="hidden"
                name="formTime"
                value={(await searchParams).time}
              />
              <input
                type="hidden"
                name="eventDate"
                value={(await searchParams).date}
              />
              <input type="hidden" name="meetingLength" value={data.duration} />
              <input
                type="hidden"
                name="provider"
                value={data.videoCallSoftware}
              />
              <input type="hidden" name="username" value={username} />
              <input type="hidden" name="eventTypeId" value={data.id} />

              <div className="flex flex-col gap-y-2 ">
                <Label>Your Name</Label>
                <Input name="name" placeholder="Your Name"></Input>
              </div>
              <div className="flex flex-col gap-y-2 ">
                <Label>Your Email</Label>
                <Input name="email" placeholder="John@example.com"></Input>
              </div>
              <SubmitButton text="Book Meeting" className="w-full mt-5" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-[1000px] w-full mx-auto">
          <CardContent className="p-5 md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 ">
            <div>
              <img
                src={data.User.image as string}
                alt="Profile Image of user"
                className="size-10 rounded-full "
              />
              <p className="text-sm font-medium text-muted-foreground mt-1 ">
                {data.User?.name}
              </p>
              <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
              <p className="text-sm font-medium text-muted-foreground ">
                {data.description}
              </p>
              <div className="mt-5 flex flex-col gap-y-3">
                <p className="flex items-center">
                  <CalendarX2 className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground ">
                    {FormatedDate}
                  </span>
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground ">
                    {data.duration} Minutes
                  </span>
                </p>
                <p className="flex items-center">
                  <VideoIcon className="mr-2 size-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground ">
                    {data.videoCallSoftware}
                  </span>
                </p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-full w-[1px]" />
            <RenderCalendar availability={data.User?.availability} />
            <Separator orientation="vertical" className="h-full w-[1px]" />
            <TimeTable
              selectedDate={selectedDate}
              userName={username}
              duration={data.duration}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
