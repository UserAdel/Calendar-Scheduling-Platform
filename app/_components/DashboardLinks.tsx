"use client";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  HomeIcon,
  LucideProps,
  Settings,
  User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface iAppProps {
  id: number;
  href: string;
  name: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const dashboardLinks: iAppProps[] = [
  { id: 0, name: "Event Types", href: "/dashboard", icon: HomeIcon },
  { id: 1, name: "Meeting", href: "/dashboard/meetings", icon: User2 },
  {
    id: 2,
    name: "Availablity",
    href: "/dashboard/availability",
    icon: CalendarCheck,
  },
  { id: 3, name: "Settings", href: "/dashboard/settings", icon: Settings },
];
export function DashboardLinks() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <>
      {dashboardLinks.map((link) => {
        return (
          <Link
            href={link.href}
            key={link.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 transition-all rounded-lg hover:text-primary",
              pathname === link.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <link.icon className="size-4" />
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
