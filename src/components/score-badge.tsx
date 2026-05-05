import { Badge } from "@/components/ui/badge";
import { scoreTone } from "@/lib/scoring";

export function ScoreBadge({ score }: { score: number }) {
  const tone = scoreTone(score);
  const className =
    tone === "critical"
      ? "border-red-400/40 bg-red-500/15 text-red-100"
      : tone === "high"
        ? "border-amber-300/40 bg-amber-400/15 text-amber-100"
        : tone === "warm"
          ? "border-primary/40 bg-primary/15 text-primary"
          : "border-border bg-muted text-muted-foreground";

  return (
    <Badge variant="outline" className={className}>
      Pain {score}
    </Badge>
  );
}
