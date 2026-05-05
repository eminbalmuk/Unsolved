import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Signal not found</h1>
        <p className="mt-3 text-muted-foreground">
          This problem is not in the MVP seed set yet.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to discovery</Link>
        </Button>
      </div>
    </main>
  );
}
