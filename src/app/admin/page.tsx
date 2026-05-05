import { AlertTriangle, Bot, Database, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pipelineStatuses, problems } from "@/lib/data";

const weights = [
  { label: "Frequency", value: 35 },
  { label: "Emotional intensity", value: 45 },
  { label: "Willingness to pay", value: 20 },
];

export default function AdminPage() {
  const warningCount = pipelineStatuses.filter(
    (status) => status.status !== "healthy",
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-muted-foreground">Internal operations</p>
          <h1 className="mt-2 text-4xl font-semibold">
            Pipeline health and scoring controls
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={Database}
            label="Raw signals"
            value="644"
            hint="Backed up before analysis"
          />
          <MetricCard
            icon={Bot}
            label="LLM clusters"
            value={String(problems.length)}
            hint="SaaS MVP scope"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Warnings"
            value={String(warningCount)}
            hint="Needs operator review"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle>Service status</CardTitle>
              <CardDescription>
                Mocked operational view for ingestion and AI pipeline health.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Latency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pipelineStatuses.map((status) => (
                    <TableRow key={status.name}>
                      <TableCell className="font-medium">{status.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status.status === "healthy" ? "secondary" : "outline"
                          }
                        >
                          {status.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-36">
                        <div className="flex items-center gap-3">
                          <Progress value={status.successRate} />
                          <span className="font-mono text-xs">
                            {status.successRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {status.latency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-card/82">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-primary" aria-hidden />
                Pain Score weights
              </CardTitle>
              <CardDescription>
                Admin-editable in the future NestJS API layer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {weights.map((weight) => (
                <div key={weight.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{weight.label}</span>
                    <span className="font-mono">{weight.value}%</span>
                  </div>
                  <Progress value={weight.value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
