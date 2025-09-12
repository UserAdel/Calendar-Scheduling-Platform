"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SubmitButton } from "./SubmitButtons";
import { settingAction } from "../actions";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { settingSchema } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";

interface iAppProps {
  fullName: string;
  email: string;
  profileImage: string;
}
export function SettingForm({ fullName, email, profileImage }: iAppProps) {
  const [lastResult, action] = useActionState(settingAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);
  const [form, field] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: settingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const handelDeleteImage = () => {
    setCurrentProfileImage("");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account setting</CardDescription>
      </CardHeader>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="Jan Max"
              name={field.fullName.name}
              key={field.fullName.id}
              defaultValue={fullName}
            />
            <p className="text-red-500 text-sm">{field.fullName.errors}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              placeholder="Test@test.com"
              name={field.email.name}
              key={field.email.id}
              defaultValue={email}
            />
            <p className="text-red-500 text-sm">{field.email.errors}</p>
          </div>
          <div className="grid gap-y-5">
            <Label>Profile Image</Label>
            <input
              type="hidden"
              name={field.profileImage.name}
              key={field.profileImage.id}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                <img
                  src={currentProfileImage}
                  alt="profile iamge"
                  className="size-16 rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-3 -right-3 size-8"
                  onClick={handelDeleteImage}
                  type="button"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Image uploaded successfully");
                }}
                onUploadError={(error) => {
                  toast.error(error.message);
                }}
              />
            )}
            <p className="text-red-500 text-sm">{field.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
