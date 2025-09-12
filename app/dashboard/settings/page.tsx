import { SettingForm } from "@/app/_components/SettingsForm";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: { id },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}
export default async function Settingsroute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <SettingForm
      email={data.email}
      fullName={data.name as string}
      profileImage={data.image as string}
    />
  );
}
