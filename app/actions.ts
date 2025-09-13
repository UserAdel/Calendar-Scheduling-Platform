"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import {
  onboardingSchema,
  onboardingSchemaValidation,
  settingSchema,
} from "@/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod/v4";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function OnBoardingAction(prevState: any, formData: FormData) {
  const user = await requireUser();
  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: { userName: formData.get("userName") as string },
        });
        return !existingUsername;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: { id: user.user?.id },
    data: {
      name: submission.value.fullName,
      userName: submission.value.userName,
      availability: {
        createMany: {
          data: [
            {
              day: "Monday",
              formTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Tuesday",
              formTime: "08:00",
              tillTime: "18:00",
            },

            {
              day: "Wednesday",
              formTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Tuesday",
              formTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Friday",
              formTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Saturday",
              formTime: "08:00",
              tillTime: "18:00",
            },
            {
              day: "Sunday",
              formTime: "08:00",
              tillTime: "18:00",
            },
          ],
        },
      },
    },
  });

  // Return success or redirect after successful submission
  return redirect("/onboarding/grant-id");
}

export async function settingAction(prevState: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, { schema: settingSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      name: submission.value.fullName,
      image: submission.value.profileImage,
    },
  });
  return redirect("/dashboard");
}

export async function updateAvailabilityAction(formData: FormData) {
  const session = await requireUser();
  const rawData = Object.fromEntries(formData.entries());
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        formTime: rawData[`formTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });
  console.log(rawData);
  console.log(availabilityData);
  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            formTime: item.formTime,
            tillTime: item.tillTime,
          },
        })
      )
    );
    revalidatePath("/dashboard/availability");
  } catch (error) {
    console.log(error);
  }
}
