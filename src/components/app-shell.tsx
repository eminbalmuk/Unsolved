import Link from "next/link";
import {
  Activity,
  BarChart3,
  Building2,
  Home,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/header-auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explora", label: "Explora", icon: Radar },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/reports", label: "Reports", icon: Building2 },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 dashboard-grid opacity-35" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_30%_10%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_42%),radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_36%)]" />
      <header className="sticky top-0 z-40 border-b bg-background/82 backdrop-blur-xl">
        <div className="mx-auto flex h-24 w-full max-w-[1680px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-md border bg-card surface-glow">
              <BarChart3 className="size-6 text-primary" aria-hidden />
            </span>
            <span>
              <span className="block text-lg font-semibold">Unsolved</span>
              <span className="block text-base text-muted-foreground">
                Problem discovery radar
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href} className="gap-2 text-lg">
                  <item.icon className="size-5" aria-hidden />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          <HeaderAuth />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
