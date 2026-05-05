import Link from "next/link";
import { Building2, FileText, KeyRound, LockKeyhole, MailCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ReportBarChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { ScoreBadge } from "@/components/score-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { weeklyReport } from "@/lib/data";
import { getCurrentUser, isAuthConfigured } from "@/lib/auth";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const authConfigured = isAuthConfigured();

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-6">
          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle>B2B report setup</CardTitle>
              <CardDescription>
                Demo configuration for weekly Monday reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue={weeklyReport.company} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input id="sector" defaultValue={weeklyReport.sector} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors</Label>
                <Textarea
                  id="competitors"
                  defaultValue="Intercom, Stripe Billing, Amplitude"
                />
              </div>
              <Button className="w-full">
                <MailCheck className="size-4" aria-hidden />
                Schedule weekly report
              </Button>
            </CardContent>
          </Card>

          <MetricCard
            icon={KeyRound}
            label="API access"
            value="Ready"
            hint="Interface stub for Enterprise"
          />
        </aside>

        <section className="space-y-6">
          {authConfigured && !user ? (
            <Card className="bg-card/82">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LockKeyhole className="size-5 text-primary" aria-hidden />
                  Sign in to configure B2B reports
                </CardTitle>
                <CardDescription className="text-base">
                  Report settings will be stored per account once Supabase is
                  connected.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <div>
            <p className="text-sm text-muted-foreground">Weekly B2B preview</p>
            <h1 className="mt-2 text-4xl font-semibold">
              Market signals for {weeklyReport.company}
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              icon={Building2}
              label="Tracked sector"
              value="B2B"
              hint="SaaS only MVP"
            />
            <MetricCard
              icon={FileText}
              label="Top problems"
              value="5"
              hint="Included in PDF"
            />
            <MetricCard
              icon={MailCheck}
              label="Delivery"
              value="09:00"
              hint="Every Monday"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <Card className="bg-card/82">
              <CardHeader>
                <CardTitle>Week-over-week trend changes</CardTitle>
                <CardDescription>
                  Mock trend deltas for the strongest market themes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportBarChart data={weeklyReport.trendDelta} />
              </CardContent>
            </Card>

            <Card className="bg-card/82">
              <CardHeader>
                <CardTitle>Competitor signal summary</CardTitle>
                <CardDescription>
                  Forum complaints grouped for report output.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyReport.competitorSignals.map((signal) => (
                  <div key={signal.competitor} className="rounded-md border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{signal.competitor}</span>
                      <Badge variant="outline">{signal.mentions}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {signal.signal}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle>Highest scored problems</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {weeklyReport.topProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-medium">{problem.title}</span>
                  <div className="flex items-center gap-3">
                    <ScoreBadge score={problem.painScore} />
                    <span className="font-mono text-sm text-muted-foreground">
                      {problem.validationCount} validators
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
