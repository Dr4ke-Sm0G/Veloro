'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const name = session.user?.name || "";
  const firstName = name.split(" ")[0] || "there";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold">
        Hello {firstName} <span className="inline-block animate-wiggle">👋</span>
      </h1>

      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={session.user.image || "/default-avatar.png"}
              alt={session.user.name || "Avatar"}
            />            <AvatarFallback>{firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{session.user.name}</CardTitle>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={() => router.push("/user/favorites")} variant="secondary">
            ❤️ My Favorites
          </Button>
          <Button onClick={() => router.push("/user/saved")} variant="secondary">
            🔍 Saved Searches
          </Button>
          <Button onClick={() => router.push("/user/settings")} variant="secondary">
            ⚙️ Account Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
