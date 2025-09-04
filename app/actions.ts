"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { onboardingSchema, onboardingSchemaValidation } from "@/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod/v4";
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
    },
  });

  // Return success or redirect after successful submission
  return redirect("/dashboard");
}
