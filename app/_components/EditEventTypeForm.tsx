"use client";
import { SubmitButton } from "@/app/_components/SubmitButtons";
import { CreateEventTypeAction, editEventTypeAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { eventTypeSchema } from "@/lib/zodSchemas";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import Link from "next/link";
import { useState } from "react";
import { useFormState } from "react-dom";
type VideoCallProvider = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";
interface iAppProps {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: number;
  callProvider: string;
}
export function EditEventForm({
  id,
  title,
  url,
  description,
  duration,
  callProvider,
}: iAppProps) {
  const [activePlatform, setActivePlatform] = useState<VideoCallProvider>(
    callProvider as VideoCallProvider
  );
  const [lastResult, action] = useFormState(editEventTypeAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: eventTypeSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center ">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Edit Appointment type</CardTitle>
          <CardDescription>
            Edit appointment type that allow people to book you
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <input type="hidden" name="id" value={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={title}
                placeholder="30 min metting"
              ></Input>
              <p className="text-red-500 text-sm">{fields.title.errors}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border broder-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  schedulepro.com/
                </span>
                <Input
                  placeholder="Example-url-1"
                  className="rounded-l-none"
                  name={fields.url.name}
                  key={fields.url.key}
                  defaultValue={url}
                ></Input>
                <p className="text-red-500 text-sm">{fields.url.errors}</p>
              </div>
            </div>

            <div className="flex flex-col gap-y-2 ">
              <Label>Description</Label>
              <Textarea
                name={fields.description.name}
                key={fields.description.key}
                defaultValue={description}
                placeholder="Meet me in the meeting to meet me!"
              ></Textarea>
              <p className="text-red-500 text-sm">
                {fields.description.errors}
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Select
                name={fields.duration.name}
                key={fields.duration.key}
                defaultValue={String(duration)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Duration</SelectLabel>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-red-500 text-sm">{fields.duration.errors}</p>
            </div>
            <div className="grid gap-y-2 ">
              <Label>Video Call Provider</Label>
              <input
                type="hidden"
                name={fields.videoCallSoftware.name}
                key={fields.videoCallSoftware.key}
                value={activePlatform}
                defaultValue={fields.videoCallSoftware.initialValue}
              />

              <ButtonGroup className="flex gap-2">
                <Button
                  onClick={() => setActivePlatform("Zoom Meeting")}
                  className="w-[33%]"
                  variant={
                    activePlatform === "Zoom Meeting" ? "secondary" : "outline"
                  }
                  type="button"
                >
                  Zoom
                </Button>
                <Button
                  onClick={() => setActivePlatform("Google Meet")}
                  className="w-[33%]"
                  variant={
                    activePlatform === "Google Meet" ? "secondary" : "outline"
                  }
                  type="button"
                >
                  Google Meet
                </Button>
                <Button
                  onClick={() => setActivePlatform("Microsoft Teams")}
                  className="w-[33%]"
                  variant={
                    activePlatform === "Microsoft Teams"
                      ? "secondary"
                      : "outline"
                  }
                  type="button"
                >
                  Microsft Teams
                </Button>
              </ButtonGroup>
              <p className="text-red-500 text-sm">
                {fields.videoCallSoftware.errors}
              </p>
            </div>
          </CardContent>
          <CardFooter className="mt-5 w-full flex justify-between">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <SubmitButton text="Edit Event Type" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
