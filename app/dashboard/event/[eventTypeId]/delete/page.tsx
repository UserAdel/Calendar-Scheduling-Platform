import { SubmitButton } from "@/app/_components/SubmitButtons";
import { DeleteEventTypeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function DeleteEventType({
  params,
}: {
  params: Promise<{ eventTypeId: string }>;
}) {
  const { eventTypeId } = await params;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-[450px] ">
        <CardHeader>
          <CardTitle>Delete Event Type</CardTitle>
          <CardDescription>
            Are you sure you want to delete this Event
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between gap-8">
          <form action={DeleteEventTypeAction}>
            <input type="hidden" name="id" value={eventTypeId} />
            <SubmitButton text="Delete Event " variant="destructive" />
          </form>

          <Button variant="secondary" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
