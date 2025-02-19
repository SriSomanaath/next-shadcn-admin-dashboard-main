
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <Card className="max-w-md w-full p-6 shadow-lg">
        <CardContent className="flex flex-col items-center text-center">
          <div className="text-2xl font-bold">404 - Page Not Found</div>
          <Separator className="my-4" />
          <p className="text-muted-foreground">
            Sorry, the page you’re looking for doesn’t exist.
          </p>
          <Link href="/dashboard" className="mt-6">
            <Button>Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
