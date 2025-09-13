import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/hooks";
import { notFound } from "next/navigation";
import { EmptyState } from "../_components/EmptyState";

export default async function DashboardPage() {
  async function getData(userId: string) {
    const data = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        userName: true,
        eventType: {
          select: {
            id: true,
            active: true,
            url: true,
            duration: true,
          },
        },
      },
    });
    if (!data) {
      return notFound();
    }
    return data;
  }
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.eventType.length === 0 ? (
        <EmptyState
          title="You have no Event Type"
          description="You can create your event type by clicking the button below"
          buttonText="Add event type"
          href="/dashboard/new"
        />
      ) : (
        <p> hey we have events</p>
      )}
    </>
  );
}
