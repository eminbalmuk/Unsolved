import { problems as seedProblems } from "@/lib/data";
import { calculatePainScore } from "@/lib/scoring";
import type {
  CompetitorGap,
  PainScoreBreakdown,
  Problem,
  ProblemCategory,
  ProblemSource,
  SourcePlatform,
} from "@/lib/types";

type RawSignal = {
  id: string;
  platform: SourcePlatform;
  title: string;
  body: string;
  url: string;
  capturedAt: string;
  author?: string;
  score?: number;
  comments?: number;
  rating?: number;
};

type RedditListing = {
  data?: {
    children?: {
      data?: {
        id?: string;
        subreddit?: string;
        title?: string;
        selftext?: string;
        permalink?: string;
        created_utc?: number;
        author?: string;
        score?: number;
        num_comments?: number;
      };
    }[];
  };
};

type AppleReviewFeed = {
  feed?: {
    entry?:
      | {
          id?: { label?: string };
          title?: { label?: string };
          content?: { label?: string };
          updated?: { label?: string };
          author?: { name?: { label?: string } };
          link?: { attributes?: { href?: string } };
          "im:rating"?: { label?: string };
        }[]
      | {
          id?: { label?: string };
          title?: { label?: string };
          content?: { label?: string };
          updated?: { label?: string };
          author?: { name?: { label?: string } };
          link?: { attributes?: { href?: string } };
          "im:rating"?: { label?: string };
        };
  };
};

const REDDIT_SUBREDDITS = ["SaaS", "startups", "ProductManagement"];
const APPLE_REVIEW_APP_IDS = ["6448311069", "618783545", "1232780281"];
const APPLE_COUNTRY = process.env.APPLE_RSS_COUNTRY ?? "us";
const USER_AGENT =
  process.env.REDDIT_USER_AGENT ?? "UnsolvedMVP/0.1 by local-dev";

const painTerms = [
  "frustrated",
  "pain",
  "annoying",
  "broken",
  "slow",
  "confusing",
  "expensive",
  "missing",
  "manual",
  "hate",
  "wish",
  "problem",
  "bug",
  "terrible",
  "hard",
  "difficult",
  "can't",
  "cannot",
  "doesn't",
  "waste",
];

const payTerms = [
  "pay",
  "paid",
  "premium",
  "subscribe",
  "subscription",
  "buy",
  "price",
  "worth",
  "invoice",
  "billing",
  "budget",
  "cost",
  "charge",
];

const featureTerms = ["wish", "need", "feature", "request", "missing", "would love"];
const bugTerms = ["bug", "broken", "crash", "error", "doesn't work", "fail"];

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, length = 220) {
  const text = compactText(value);
  return text.length > length ? `${text.slice(0, length - 1)}...` : text;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function keywordScore(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.reduce((score, term) => score + (lower.includes(term) ? 1 : 0), 0);
}

function classifySignal(text: string): ProblemCategory {
  const lower = text.toLowerCase();

  if (keywordScore(lower, bugTerms) >= 1) return "Bug";
  if (keywordScore(lower, featureTerms) >= 1) return "Feature Request";
  if (keywordScore(lower, painTerms) >= 2) return "Experience Gap";

  return "Experience Gap";
}

function inferTags(text: string) {
  const lower = text.toLowerCase();
  const tags = new Set<string>();

  if (lower.includes("billing") || lower.includes("invoice")) tags.add("billing");
  if (lower.includes("ai") || lower.includes("bot")) tags.add("ai");
  if (lower.includes("support") || lower.includes("ticket")) tags.add("support");
  if (lower.includes("analytics") || lower.includes("dashboard")) tags.add("analytics");
  if (lower.includes("api") || lower.includes("developer")) tags.add("developer tools");
  if (lower.includes("security") || lower.includes("permission")) tags.add("security");
  if (lower.includes("mobile") || lower.includes("app")) tags.add("mobile");

  if (tags.size === 0) tags.add("saas");

  return Array.from(tags).slice(0, 4);
}

function scoreBreakdown(signal: RawSignal): PainScoreBreakdown {
  const text = `${signal.title} ${signal.body}`;
  const painHits = keywordScore(text, painTerms);
  const payHits = keywordScore(text, payTerms);
  const platformBoost = signal.platform === "Reddit" ? signal.comments ?? 0 : 0;
  const lowRatingBoost =
    signal.rating && signal.rating <= 3 ? (4 - signal.rating) * 16 : 0;

  return {
    frequency: Math.min(100, 45 + Math.log10((signal.score ?? 1) + 1) * 18 + platformBoost * 0.9),
    emotionalIntensity: Math.min(100, 42 + painHits * 9 + lowRatingBoost),
    willingnessToPay: Math.min(100, 38 + payHits * 14 + (text.toLowerCase().includes("$") ? 14 : 0)),
  };
}

function competitorGaps(tags: string[]): CompetitorGap[] {
  if (tags.includes("billing")) {
    return [
      {
        tool: "Stripe Billing",
        gap: "Live data signal suggests customers still need clearer billing explanations.",
        complaintTheme: "Billing transparency",
      },
      {
        tool: "Chargebee",
        gap: "Users appear to want simpler previews and customer-safe messaging.",
        complaintTheme: "Invoice confidence",
      },
    ];
  }

  if (tags.includes("support") || tags.includes("ai")) {
    return [
      {
        tool: "Intercom",
        gap: "Live complaints suggest handoff and context quality remain differentiators.",
        complaintTheme: "Support continuity",
      },
      {
        tool: "Zendesk",
        gap: "Users still ask for more action-ready summaries and automation clarity.",
        complaintTheme: "Agent workflow",
      },
    ];
  }

  return [
    {
      tool: "Existing SaaS tools",
      gap: "Current tools appear to leave repeated workflow friction unresolved.",
      complaintTheme: "Experience gap",
    },
    {
      tool: "Manual workaround",
      gap: "Users are compensating with spreadsheets, support threads, or custom processes.",
      complaintTheme: "Manual operations",
    },
  ];
}

function signalToProblem(signal: RawSignal, index: number): Problem {
  const text = `${signal.title}. ${signal.body}`;
  const tags = inferTags(text);
  const breakdown = scoreBreakdown(signal);
  const painScore = calculatePainScore(breakdown);
  const source: ProblemSource = {
    id: `live-source-${signal.id}`,
    platform: signal.platform,
    author: signal.author ? "anonymous_public_user" : "public_source",
    excerpt: truncate(signal.body || signal.title),
    url: signal.url,
    capturedAt: signal.capturedAt,
  };

  return {
    id: `live-${signal.platform.toLowerCase().replace(/\s+/g, "-")}-${signal.id}`,
    slug: `${slugify(signal.title)}-${index + 1}`,
    title: truncate(signal.title, 96),
    sector: tags.includes("developer tools")
      ? "Developer Tools"
      : tags.includes("mobile")
        ? "Mobile Apps"
        : "SaaS",
    category: classifySignal(text),
    status: painScore >= 84 ? "validated" : "rising",
    summary: truncate(signal.body || signal.title, 150),
    aiSummary: `Live heuristic summary: this ${signal.platform} signal repeats a concrete customer pain around ${tags.join(", ")}. It should be reviewed against more sources before product commitment.`,
    painScore,
    scoreBreakdown: breakdown,
    validationCount: Math.max(8, Math.round((signal.comments ?? 0) + painScore / 3)),
    lastSeenAt: signal.capturedAt,
    sourceCount: Math.max(1, signal.comments ?? 1),
    sourcePlatforms: [signal.platform],
    trend: [
      { label: "Now -4w", score: Math.max(35, painScore - 18), mentions: 6 },
      { label: "Now -3w", score: Math.max(38, painScore - 13), mentions: 10 },
      { label: "Now -2w", score: Math.max(42, painScore - 8), mentions: 15 },
      { label: "Now -1w", score: Math.max(45, painScore - 4), mentions: 19 },
      { label: "Live", score: painScore, mentions: Math.max(22, signal.comments ?? 12) },
    ],
    sources: [source],
    competitors: competitorGaps(tags),
    opportunity: `Investigate a narrow product wedge for ${tags.join(", ")} using this live source plus additional validation interviews.`,
    tags,
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} for ${url}`);
  }

  return response.json() as Promise<T>;
}

async function fetchRedditSignals() {
  const query = encodeURIComponent(
    '"I wish" OR frustrated OR pain OR problem OR "doesn\'t work"',
  );
  const feeds = await Promise.allSettled(
    REDDIT_SUBREDDITS.map((subreddit) =>
      fetchJson<RedditListing>(
        `https://www.reddit.com/r/${subreddit}/search.json?q=${query}&restrict_sr=1&sort=new&limit=8`,
        { headers: { "User-Agent": USER_AGENT } },
      ),
    ),
  );

  return feeds.flatMap((result) => {
    if (result.status !== "fulfilled") return [];

    return (
      result.value.data?.children
        ?.map((child): RawSignal | null => {
          const data = child.data;
          if (!data?.id || !data.title) return null;
          const body = compactText(data.selftext ?? "");
          if (body.length < 40) return null;

          return {
            id: data.id,
            platform: "Reddit",
            title: data.title,
            body,
            author: data.author,
            score: data.score,
            comments: data.num_comments,
            capturedAt: new Date((data.created_utc ?? Date.now() / 1000) * 1000).toISOString(),
            url: `https://www.reddit.com${data.permalink ?? ""}`,
          };
        })
        .filter((signal): signal is RawSignal => Boolean(signal)) ?? []
    );
  });
}

async function fetchAppleReviewSignals() {
  const feeds = await Promise.allSettled(
    APPLE_REVIEW_APP_IDS.map((id) =>
      fetchJson<AppleReviewFeed>(
        `https://itunes.apple.com/${APPLE_COUNTRY}/rss/customerreviews/id=${id}/sortBy=mostRecent/json`,
      ),
    ),
  );

  return feeds.flatMap((result) => {
    if (result.status !== "fulfilled") return [];
    const entries = result.value.feed?.entry;
    const normalizedEntries = Array.isArray(entries) ? entries : entries ? [entries] : [];

    return normalizedEntries
      .map((entry): RawSignal | null => {
        const title = entry.title?.label;
        const body = entry.content?.label;
        const id = entry.id?.label;
        if (!title || !body || !id) return null;

        return {
          id,
          platform: "App Store",
          title,
          body,
          author: entry.author?.name?.label,
          rating: Number(entry["im:rating"]?.label ?? 5),
          capturedAt: entry.updated?.label
            ? new Date(entry.updated.label).toISOString()
            : new Date().toISOString(),
          url: entry.link?.attributes?.href ?? "https://apps.apple.com",
        };
      })
      .filter((signal): signal is RawSignal => Boolean(signal))
      .filter((signal) => (signal.rating ?? 5) <= 4 || keywordScore(`${signal.title} ${signal.body}`, painTerms) > 0)
      .slice(0, 8);
  });
}

export async function getLiveSignals() {
  const [reddit, apple] = await Promise.allSettled([
    fetchRedditSignals(),
    fetchAppleReviewSignals(),
  ]);

  return [
    ...(reddit.status === "fulfilled" ? reddit.value : []),
    ...(apple.status === "fulfilled" ? apple.value : []),
  ];
}

export async function getLiveProblems() {
  const signals = await getLiveSignals();

  if (signals.length === 0) {
    return seedProblems;
  }

  const liveProblems = signals
    .map(signalToProblem)
    .sort((a, b) => b.painScore - a.painScore)
    .slice(0, 16);

  return liveProblems.length > 0 ? liveProblems : seedProblems;
}

export async function getLiveProblemBySlug(slug: string) {
  const liveProblem = (await getLiveProblems()).find(
    (problem) => problem.slug === slug || problem.id === slug,
  );

  return liveProblem ?? seedProblems.find((problem) => problem.slug === slug || problem.id === slug);
}

export async function getHotLiveProblem() {
  const liveProblems = await getLiveProblems();
  return liveProblems.slice().sort((a, b) => b.painScore - a.painScore)[0];
}
