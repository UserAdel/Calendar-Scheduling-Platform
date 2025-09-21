import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Logo from "@/public/LOGO.png";
import Image from "next/image";
import { GitHubAuthButton, GoogleAuthButton } from "./SubmitButtons";
import { signInWithGoogle, signInWithGitHub } from "@/app/actions";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Try for free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px] ">
        <DialogHeader className="flex-row items-center justify-center gap-2">
          <Image
            src={Logo}
            alt="LOGO"
            className="size-12"
            width={120}
            height={120}
          />
          <DialogTitle className="text-3xl font-semibold">
            Schedule<span className="text-primary">Pro</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-3">
          <form action={signInWithGoogle} className="w-full">
            <GoogleAuthButton />
          </form>
          <form action={signInWithGitHub} className="w-full">
            <GitHubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
