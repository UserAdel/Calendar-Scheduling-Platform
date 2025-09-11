import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CalendarCheck2 } from "lucide-react";
import Link from "next/link";

export default function OnBoardingrouteTwo() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Your almost done</CardTitle>
          <CardDescription>
            We have to now connect your calender to your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={"/api/auth"}>
              <CalendarCheck2 className="size-4 mr-2" />
              Connect Calendar to our Account
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
