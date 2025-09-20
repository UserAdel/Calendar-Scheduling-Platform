"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import {
  eventTypeSchema,
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
              day: "Thursday",
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

export async function CreateEventTypeAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();
  const submission = parseWithZod(formData, { schema: eventTypeSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  if (!session.user?.id) {
    throw new Error("User ID is required");
  }

  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
      userId: session.user.id,
    },
  });

  return redirect("/dashboard");
}

export async function CreateMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });
  if (!getUserData) {
    throw new Error("User not found");
  }
  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });
  const formTime = formData.get("formTime") as string;
  const eventDate = formData.get("eventDate") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const provider = formData.get("provider") as string;
  const startDateTime = new Date(`${eventDate}T${formTime}:00`);
  const endDateTime = new Date(
    startDateTime.getTime() + meetingLength * 60 * 1000
  );

  await nylas.events.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: { autocreate: {}, provider: provider as any },
      participants: [
        {
          email: formData.get("email") as string,
          name: formData.get("name") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData.grantEmail as string,
      notifyParticipants: true,
    },
  });
  return redirect("/success");
}

export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });
  if (!userData) {
    throw new Error("User not found");
  }
  const data = await nylas.events.destroy({
    eventId: formData.get("eventId") as string,
    identifier: userData.grantId as string,
    queryParams: { calendarId: userData.grantEmail as string },
  });
  revalidatePath("/dashboard/meetings");
}

export async function editEventTypeAction(prevState: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, { schema: eventTypeSchema });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.eventType.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  });
  return redirect("/dashboard");
}

export async function UpdateEventTypeStatusAction(
  prevState: any,
  {
    eventTypeId,
    isChecked,
  }: {
    eventTypeId: string;
    isChecked: boolean;
  }
) {
  try {
    const session = await requireUser();
    const data = await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id,
      },
      data: {
        active: isChecked,
      },
    });
    revalidatePath("/dashboard");
    return {
      status: "success",
      message: "Event Type Status Updated!",
    };
  } catch (error) {
    return {
      status: "error",
      message: "something went wrong",
    };
  }
}

export async function DeleteEventTypeAction(formData: FormData) {
  const session = await requireUser();
  const data = await prisma.eventType.delete({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
  });
  return redirect("/dashboard");
}
