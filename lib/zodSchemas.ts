import { conformZodMessage } from "@conform-to/zod/v4";
import { email, z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.coerce
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .min(3, { message: "Full name must be at least 3 characters" })
    .max(150),
  userName: z.coerce
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(150)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username can only contain letters, number and -",
    }),
});

export function onboardingSchemaValidation(options?: {
  isUsernameUnique?: () => Promise<boolean>;
}) {
  return z.object({
    userName: z
      .string()
      .min(3)
      .max(150)
      .regex(/^[a-zA-Z0-9-_]+$/, {
        message: "Username can only contain letters, number and _-",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUsernameUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }
          return options.isUsernameUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already taken",
              });
            }
          });
        })
      ),
    fullName: z.coerce
      .string()
      .trim()
      .min(1, { message: "Full name is required" })
      .min(3, { message: "Full name must be at least 3 characters" })
      .max(150),
  });
}

export const settingSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" })
    .max(150, { message: "Full name must be at most 150 characters" }),
  profileImage: z.string(),
  email: z.string(),
});
