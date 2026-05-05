import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  ExternalLink,
  FileSearch,
  Gauge,
  Layers3,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BreakdownChart, TrendChart } from "@/components/charts";
import { ProblemAnalysisPanel } from "@/components/problem-analysis-panel";
import { ScoreBadge } from "@/components/score-badge";
import { ValidateButton } from "@/components/validate-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getLiveProblemBySlug } from "@/lib/ingestion";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const problem = await getLiveProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  const scoreRows = [
    ["Frequency", problem.scoreBreakdown.frequency],
    ["Emotional intensity", problem.scoreBreakdown.emotionalIntensity],
    ["Willingness to pay", problem.scoreBreakdown.willingnessToPay],
  ] as const;

  return (
    <AppShell>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <section className="space-y-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden />
              Back to discovery
            </Link>
          </Button>

          <Card className="bg-card/82">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <ScoreBadge score={problem.painScore} />
                <Badge variant="secondary">{problem.category}</Badge>
                <Badge variant="outline">{problem.status}</Badge>
              </div>
              <div>
                <CardTitle className="max-w-4xl text-4xl">
                  {problem.title}
                </CardTitle>
                <CardDescription className="mt-3 max-w-3xl text-base leading-7">
                  {problem.summary}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-3">
              {scoreRows.map(([label, value]) => (
                <div key={label} className="rounded-md border bg-background/45 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                  <Progress value={value} className="mt-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <ProblemAnalysisPanel problemId={problem.slug} />

            <Card className="bg-card/82">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gauge className="size-5 text-primary" aria-hidden />
                  Score mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BreakdownChart breakdown={problem.scoreBreakdown} />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSearch className="size-5 text-primary" aria-hidden />
                Raw source evidence
              </CardTitle>
              <CardDescription>
                Public snippets are anonymized and linked to their source type.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-md border bg-background/45 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Bot className="size-4 text-primary" aria-hidden />
                  <span className="text-sm font-medium">
                    Ön analiz sinyali
                  </span>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {problem.aiSummary}
                </p>
                <Separator className="my-4" />
                <p className="text-sm leading-6">{problem.opportunity}</p>
              </div>
              {problem.sources.map((source) => (
                <div key={source.id} className="rounded-md border bg-background/45 p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{source.platform}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {source.author}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {source.excerpt}
                  </p>
                  <Button variant="link" className="mt-2 h-auto p-0" asChild>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      Source link
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle>Validate market intent</CardTitle>
              <CardDescription>
                Demo state prevents duplicate validation in this session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ValidateButton
                problemId={problem.id}
                initialCount={problem.validationCount}
              />
            </CardContent>
          </Card>

          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers3 className="size-5 text-primary" aria-hidden />
                Market gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {problem.competitors.map((competitor) => (
                <div key={competitor.tool} className="rounded-md border p-4">
                  <div className="font-medium">{competitor.tool}</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {competitor.gap}
                  </p>
                  <Badge variant="outline" className="mt-3">
                    {competitor.complaintTheme}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle className="text-lg">Trend history</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart problem={problem} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
