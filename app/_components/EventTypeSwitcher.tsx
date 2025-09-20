"use client";
import { Switch } from "@/components/ui/switch";
import { useFormState } from "react-dom";
import { UpdateEventTypeStatusAction } from "../actions";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

export function MenuActiveSwitch({
  initialChecked,
  eventTypeId,
}: {
  initialChecked: boolean;
  eventTypeId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, active] = useFormState(UpdateEventTypeStatusAction, undefined);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message);
    } else if (state?.status === "error") {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <Switch
      disabled={isPending}
      defaultChecked={initialChecked}
      onCheckedChange={(isChecked) => {
        startTransition(() => {
          active({ eventTypeId: eventTypeId, isChecked: isChecked });
        });
      }}
    />
  );
}
