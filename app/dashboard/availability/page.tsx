import { SubmitButton } from "@/app/_components/SubmitButtons";
import { updateAvailabilityAction } from "@/app/actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { times } from "@/lib/times";

import { notFound } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
    // select: {},
  });
  if (!data) {
    return notFound();
  }
  return data;
}
export default async function AvailabilityPage() {
  const session = await requireUser();
  const data = getData(session.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          In This Section you can manage your availability
        </CardDescription>
      </CardHeader>
      <form action={updateAvailabilityAction}>
        <CardContent className="flex flex-col gap-y-4">
          {(await data).map((item) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
              key={item.id}
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />
              <div className="flex items-center gap-x-2">
                <Switch
                  name={`isActive-${item.id}`}
                  defaultChecked={item.isActive}
                />
                <p>{item.day}</p>
              </div>
              <Select name={`formTime-${item.id}`} defaultValue={item.formTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="from Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem value={time.time} key={time.id}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Till Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem value={time.time} key={time.id}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter className="mt-4">
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
