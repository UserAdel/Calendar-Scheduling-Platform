import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/LOGO.png";
import { DashboardLinks } from "../_components/DashboardLinks";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../_components/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { requireUser } from "@/lib/hooks";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();
  return (
    <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block border-r bg-muted/40">
        <div className="flex w-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-x">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="LOGO"
                className="size-8"
                width={120}
                height={120}
              />
              <p className="text-xl font-bold">
                Cal<span className="text-primary">Marshal</span>
              </p>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 lg:px-4">
              <DashboardLinks />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="md:hidden shrink-0"
                size="icon"
                variant="outline"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 mt-10">
                <DashboardLinks />
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex item-center gap-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <img
                    src={session?.user?.image as string}
                    alt="profile image"
                    width={20}
                    height={20}
                    className="w-full h-full rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form
                    className="w-full"
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button className="w-full text-left" type="submit">
                      Logout
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
