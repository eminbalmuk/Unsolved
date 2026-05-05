import { calculatePainScore } from "@/lib/scoring";
import type { PipelineStatus, Problem, WeeklyReport } from "@/lib/types";

const rawProblems: Omit<Problem, "painScore">[] = [
  {
    id: "prb-001",
    slug: "billing-proration-confusion",
    title: "Billing proration still feels impossible to explain",
    sector: "SaaS",
    category: "Experience Gap",
    status: "validated",
    summary:
      "Subscription teams cannot explain mid-cycle upgrades, credits, and invoice corrections without long support threads.",
    aiSummary:
      "AI-generated summary: SaaS buyers understand that usage and seat counts change, but they lose trust when invoices show opaque credits. The strongest signal is demand for a customer-facing proration preview before plan changes are confirmed.",
    scoreBreakdown: {
      frequency: 91,
      emotionalIntensity: 88,
      willingnessToPay: 76,
    },
    validationCount: 47,
    lastSeenAt: "2026-04-26T08:45:00.000Z",
    sourceCount: 184,
    sourcePlatforms: ["Reddit", "X", "Forum"],
    trend: [
      { label: "Mar 31", score: 69, mentions: 24 },
      { label: "Apr 07", score: 74, mentions: 39 },
      { label: "Apr 14", score: 81, mentions: 61 },
      { label: "Apr 21", score: 87, mentions: 86 },
      { label: "Apr 27", score: 89, mentions: 102 },
    ],
    sources: [
      {
        id: "src-001",
        platform: "Reddit",
        author: "anonymous_saas_admin",
        excerpt:
          "I spent half a day explaining why an upgrade created two credits and a new line item. Customers read it as a double charge.",
        url: "https://reddit.com/r/SaaS",
        capturedAt: "2026-04-26T08:45:00.000Z",
      },
      {
        id: "src-002",
        platform: "Forum",
        author: "billing_ops",
        excerpt:
          "We need a preview that says exactly what the customer will pay today and what changes next invoice.",
        url: "https://community.example.com/billing",
        capturedAt: "2026-04-25T18:12:00.000Z",
      },
    ],
    competitors: [
      {
        tool: "Stripe Billing",
        gap: "Powerful primitives, but explanation layers are left to each product team.",
        complaintTheme: "Invoice transparency",
      },
      {
        tool: "Chargebee",
        gap: "Admins can model changes, but customer-facing previews remain rigid.",
        complaintTheme: "Customer trust",
      },
    ],
    opportunity:
      "A hosted proration explainer that plugs into billing providers and renders customer-safe previews before plan changes.",
    tags: ["billing", "subscription", "finance ops"],
  },
  {
    id: "prb-002",
    slug: "ai-support-handoff-memory-loss",
    title: "AI support agents forget context when a human takes over",
    sector: "SaaS",
    category: "Feature Request",
    status: "rising",
    summary:
      "Support leaders want AI triage to produce a compact, trustworthy handoff that agents can act on immediately.",
    aiSummary:
      "AI-generated summary: The pain is not only bot quality. Teams lose time because human agents receive partial transcripts without intent, attempted fixes, entitlement data, or confidence markers.",
    scoreBreakdown: {
      frequency: 78,
      emotionalIntensity: 84,
      willingnessToPay: 82,
    },
    validationCount: 34,
    lastSeenAt: "2026-04-27T06:10:00.000Z",
    sourceCount: 139,
    sourcePlatforms: ["Reddit", "App Store", "X"],
    trend: [
      { label: "Mar 31", score: 58, mentions: 14 },
      { label: "Apr 07", score: 66, mentions: 29 },
      { label: "Apr 14", score: 72, mentions: 43 },
      { label: "Apr 21", score: 80, mentions: 68 },
      { label: "Apr 27", score: 82, mentions: 81 },
    ],
    sources: [
      {
        id: "src-003",
        platform: "Reddit",
        author: "cx_lead_41",
        excerpt:
          "The bot asks five questions, then the agent asks the same five again. We are paying for deflection and creating more frustration.",
        url: "https://reddit.com/r/customerexperience",
        capturedAt: "2026-04-27T06:10:00.000Z",
      },
      {
        id: "src-004",
        platform: "X",
        author: "masked_founder",
        excerpt:
          "Human handoff needs a clean case brief: what happened, what failed, account tier, urgency, and what to try next.",
        url: "https://x.com",
        capturedAt: "2026-04-24T11:20:00.000Z",
      },
    ],
    competitors: [
      {
        tool: "Intercom Fin",
        gap: "Strong AI entry point, but handoff quality varies by workflow setup.",
        complaintTheme: "Agent repetition",
      },
      {
        tool: "Zendesk AI",
        gap: "Summaries exist, but users ask for action-ready diagnosis and confidence.",
        complaintTheme: "Context loss",
      },
    ],
    opportunity:
      "A universal AI-to-human handoff layer that writes structured case briefs across helpdesk tools.",
    tags: ["support", "ai agents", "cx"],
  },
  {
    id: "prb-003",
    slug: "workspace-permission-drift",
    title: "Permission drift creates silent security holes in small teams",
    sector: "Operations",
    category: "Bug",
    status: "rising",
    summary:
      "Founders and ops teams lose track of who still has access after role changes, agency work, and tool churn.",
    aiSummary:
      "AI-generated summary: The recurring complaint is not enterprise IAM complexity, but the lack of lightweight reminders and owner-friendly explanations for small SaaS stacks.",
    scoreBreakdown: {
      frequency: 73,
      emotionalIntensity: 86,
      willingnessToPay: 69,
    },
    validationCount: 29,
    lastSeenAt: "2026-04-25T14:22:00.000Z",
    sourceCount: 96,
    sourcePlatforms: ["Reddit", "Forum"],
    trend: [
      { label: "Mar 31", score: 61, mentions: 20 },
      { label: "Apr 07", score: 65, mentions: 27 },
      { label: "Apr 14", score: 70, mentions: 35 },
      { label: "Apr 21", score: 76, mentions: 48 },
      { label: "Apr 27", score: 78, mentions: 57 },
    ],
    sources: [
      {
        id: "src-005",
        platform: "Forum",
        author: "ops_generalist",
        excerpt:
          "We discover ex-contractors still have access only when someone audits a random tool. It is embarrassing and risky.",
        url: "https://community.example.com/security",
        capturedAt: "2026-04-25T14:22:00.000Z",
      },
    ],
    competitors: [
      {
        tool: "Okta",
        gap: "Too heavy for tiny teams with informal workflows.",
        complaintTheme: "Setup overhead",
      },
      {
        tool: "Google Workspace Admin",
        gap: "Covers one surface but misses SaaS sprawl.",
        complaintTheme: "Cross-tool visibility",
      },
    ],
    opportunity:
      "A lightweight access drift monitor for teams under 50 that explains risk in plain language.",
    tags: ["security", "ops", "access"],
  },
  {
    id: "prb-004",
    slug: "product-analytics-question-gap",
    title: "Product analytics tools answer charts, not plain questions",
    sector: "SaaS",
    category: "Feature Request",
    status: "validated",
    summary:
      "PMs want to ask natural-language product questions and get reproducible analysis, not only generated chart guesses.",
    aiSummary:
      "AI-generated summary: Users are willing to pay for analysis that cites events, filters, and confidence. The gap is an analyst-grade reasoning trail, not a prettier dashboard.",
    scoreBreakdown: {
      frequency: 86,
      emotionalIntensity: 74,
      willingnessToPay: 88,
    },
    validationCount: 53,
    lastSeenAt: "2026-04-23T10:05:00.000Z",
    sourceCount: 151,
    sourcePlatforms: ["Reddit", "X", "App Store"],
    trend: [
      { label: "Mar 31", score: 72, mentions: 36 },
      { label: "Apr 07", score: 75, mentions: 40 },
      { label: "Apr 14", score: 79, mentions: 51 },
      { label: "Apr 21", score: 80, mentions: 58 },
      { label: "Apr 27", score: 81, mentions: 64 },
    ],
    sources: [
      {
        id: "src-006",
        platform: "Reddit",
        author: "pm_no_sql",
        excerpt:
          "I can make charts, but I need to ask why activation dropped for one segment and trust the answer enough to present it.",
        url: "https://reddit.com/r/ProductManagement",
        capturedAt: "2026-04-23T10:05:00.000Z",
      },
    ],
    competitors: [
      {
        tool: "Amplitude",
        gap: "Deep analysis, steep learning curve for casual stakeholders.",
        complaintTheme: "Analyst dependency",
      },
      {
        tool: "Mixpanel",
        gap: "Fast exploration, but AI answers need clearer data provenance.",
        complaintTheme: "Trust in answers",
      },
    ],
    opportunity:
      "A question-first product analyst that cites event definitions and produces shareable reasoning trails.",
    tags: ["analytics", "product", "ai"],
  },
  {
    id: "prb-005",
    slug: "api-changelog-consumer-risk",
    title: "API changelogs do not tell customers what will break",
    sector: "Developer Tools",
    category: "Experience Gap",
    status: "rising",
    summary:
      "Developer tool customers need impact-aware API change alerts instead of generic release notes.",
    aiSummary:
      "AI-generated summary: Teams complain that changelogs list endpoint updates but do not map them to the customer's actual usage, SDK version, or webhook behavior.",
    scoreBreakdown: {
      frequency: 69,
      emotionalIntensity: 79,
      willingnessToPay: 84,
    },
    validationCount: 22,
    lastSeenAt: "2026-04-22T19:31:00.000Z",
    sourceCount: 74,
    sourcePlatforms: ["Reddit", "Forum", "X"],
    trend: [
      { label: "Mar 31", score: 55, mentions: 11 },
      { label: "Apr 07", score: 59, mentions: 16 },
      { label: "Apr 14", score: 64, mentions: 24 },
      { label: "Apr 21", score: 72, mentions: 35 },
      { label: "Apr 27", score: 75, mentions: 43 },
    ],
    sources: [
      {
        id: "src-007",
        platform: "Forum",
        author: "platform_engineer",
        excerpt:
          "A changelog should say whether my integration is affected. Otherwise it becomes another inbox chore.",
        url: "https://community.example.com/api",
        capturedAt: "2026-04-22T19:31:00.000Z",
      },
    ],
    competitors: [
      {
        tool: "ReadMe",
        gap: "Good documentation layer, limited customer-specific blast radius.",
        complaintTheme: "Change relevance",
      },
      {
        tool: "Stoplight",
        gap: "Strong spec workflow, less focused on runtime consumer alerts.",
        complaintTheme: "Customer-specific impact",
      },
    ],
    opportunity:
      "An API change monitor that matches changelog entries to customer usage and sends impact-ranked alerts.",
    tags: ["developer tools", "api", "docs"],
  },
];

export const problems: Problem[] = rawProblems.map((problem) => ({
  ...problem,
  painScore: calculatePainScore(problem.scoreBreakdown),
}));

export const pipelineStatuses: PipelineStatus[] = [
  {
    name: "Reddit ingestion",
    status: "healthy",
    successRate: 98,
    lastRunAt: "2026-04-27T06:00:00.000Z",
    latency: "4m 12s",
  },
  {
    name: "App review import",
    status: "healthy",
    successRate: 94,
    lastRunAt: "2026-04-27T02:30:00.000Z",
    latency: "8m 45s",
  },
  {
    name: "LLM clustering",
    status: "warning",
    successRate: 89,
    lastRunAt: "2026-04-27T06:30:00.000Z",
    latency: "21m 06s",
  },
  {
    name: "Vector indexing",
    status: "healthy",
    successRate: 96,
    lastRunAt: "2026-04-27T06:45:00.000Z",
    latency: "2m 34s",
  },
];

export const weeklyReport: WeeklyReport = {
  company: "Northstar Labs",
  sector: "B2B SaaS",
  generatedAt: "2026-04-27T09:00:00.000Z",
  topProblems: problems
    .slice()
    .sort((a, b) => b.painScore - a.painScore)
    .slice(0, 5)
    .map(({ id, title, painScore, validationCount }) => ({
      id,
      title,
      painScore,
      validationCount,
    })),
  trendDelta: [
    { label: "Support AI", value: 38 },
    { label: "Billing ops", value: 31 },
    { label: "Security drift", value: 24 },
    { label: "API docs", value: 18 },
  ],
  competitorSignals: [
    {
      competitor: "Intercom",
      signal: "Repeated complaints about handoff summaries",
      mentions: 42,
    },
    {
      competitor: "Stripe Billing",
      signal: "Confusion around credits and customer invoices",
      mentions: 37,
    },
    {
      competitor: "Amplitude",
      signal: "Stakeholders want plain-language analysis",
      mentions: 29,
    },
  ],
};

export function getProblemBySlug(slug: string) {
  return problems.find((problem) => problem.slug === slug);
}

export function getHotProblem() {
  return problems.slice().sort((a, b) => b.painScore - a.painScore)[0];
}
