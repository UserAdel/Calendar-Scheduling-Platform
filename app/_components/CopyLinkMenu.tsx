"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

export function CopyLinkMenu({ meetingUrl }: { meetingUrl: string }) {
  const handelCopy = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      toast.success("URL has been copied");
    } catch (error) {
      toast.error("Could not copy the url");
    }
  };
  return (
    <DropdownMenuItem onSelect={handelCopy}>
      <Link2 className="mr-2 size-4" /> Copy
    </DropdownMenuItem>
  );
}
