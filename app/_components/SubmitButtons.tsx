"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleIcon from "@/public/googleIcon.svg";
import githubIcon from "@/public/github.svg";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface iAppProps {
  text: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
}

export function SubmitButton({ text, variant, className }: iAppProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant="outline" className={cn("w-fit", className)}>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Please Wait...
        </Button>
      ) : (
        <Button
          variant={variant}
          type="submit"
          className={cn("w-fit", className)}
        >
          {text}
        </Button>
      )}
    </>
  );
}

export function GoogleAuthButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button type="submit" disabled variant="outline" className="w-full">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Signing in...
        </Button>
      ) : (
        <Button type="submit" variant="outline" className="w-full">
          <Image src={googleIcon} alt="googleIcon" className="size-4 mr-2" />
          Sign in with Google
        </Button>
      )}
    </>
  );
}

export function GitHubAuthButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button type="submit" disabled variant="outline" className="w-full">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Signing in...
        </Button>
      ) : (
        <Button type="submit" variant="outline" className="w-full">
          <Image src={githubIcon} alt="githubIcon" className="size-4 mr-2" />
          Sign in with GitHub
        </Button>
      )}
    </>
  );
}
