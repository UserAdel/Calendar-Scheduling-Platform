"use client";
import { Button } from "@/components/ui/button";
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
import { useFormState } from "react-dom";
import { OnBoardingAction } from "../actions";
import { useForm, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { onboardingSchema } from "@/lib/zodSchemas";
import { SubmitButton } from "../_components/SubmitButtons";

export default function Onboarding() {
  const [lastResult, action] = useFormState(OnBoardingAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: onboardingSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome to Cal<span className="text-primary">Marshal</span>
          </CardTitle>
          <CardDescription>
            We need the following information to set up your profile
          </CardDescription>
        </CardHeader>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          method="POST"
          noValidate
        >
          <CardContent className="flex flex-col gap-y-5">
            <div className="grid gap-y-2">
              <Label htmlFor={fields.fullName.id}>Full Name</Label>
              <Input
                placeholder="Adel Hany"
                {...getInputProps(fields.fullName, { type: "text" })}
              />
              {fields.fullName.errors && fields.fullName.errors.length > 0 && (
                <div className="text-red-500 text-sm">
                  {fields.fullName.errors.map((err) => (
                    <p key={err}>{err}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-y-2">
              <Label htmlFor={fields.userName.id}>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  calMarshal.com
                </span>
                <Input
                  placeholder="example-user-1"
                  className="rounded-l-none"
                  {...getInputProps(fields.userName, { type: "text" })}
                />
              </div>
              {fields.userName.errors && fields.userName.errors.length > 0 && (
                <div className="text-red-500 text-sm">
                  {fields.userName.errors.map((err) => (
                    <p key={err}>{err}</p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Submit" className="w-full mt-4" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
