import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="bg-card/78">
      <CardContent className="flex items-center gap-4 p-6">
        <span className="grid size-12 place-items-center rounded-md bg-primary/12 text-primary">
          <Icon className="size-6" aria-hidden />
        </span>
        <span>
          <span className="block text-sm text-muted-foreground">{label}</span>
          <span className="block text-3xl font-semibold">{value}</span>
          <span className="block text-sm text-muted-foreground">{hint}</span>
        </span>
      </CardContent>
    </Card>
  );
}
