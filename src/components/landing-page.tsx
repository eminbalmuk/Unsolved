"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  DatabaseZap,
  Gauge,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "live signals", value: "48+" },
  { label: "market lanes", value: "4" },
  { label: "avg. Pain Score", value: "81" },
];

const steps = [
  {
    icon: DatabaseZap,
    title: "Collect public evidence",
    text: "Reddit threads, reviews, forums, and social signals become structured market evidence.",
  },
  {
    icon: Bot,
    title: "Cluster the repeated pain",
    text: "AI groups complaints into problems, removes noise, and keeps source snippets attached.",
  },
  {
    icon: Gauge,
    title: "Rank by real urgency",
    text: "Frequency, emotional intensity, and willingness to pay combine into one usable Pain Score.",
  },
];

const featureCards = [
  {
    title: "Problem radar",
    text: "See what is rising before it becomes another crowded product category.",
    image: "/images/hero-problem-radar.webp",
  },
  {
    title: "Market gap map",
    text: "Compare existing tools against the complaints users still repeat every week.",
    image: "/images/market-gap-map.webp",
  },
  {
    title: "Evidence trail",
    text: "Trace every AI summary back to anonymized snippets and source platforms.",
    image: "/images/ai-evidence-panel.webp",
  },
  {
    title: "Responsive workspace",
    text: "Carry the same market board from laptop research sessions to quick mobile checks.",
    image: "/images/responsive-analytics-devices.webp",
  },
];

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.08]);
  const signalY = useTransform(scrollYProgress, [0.12, 0.72], [80, -80]);

  return (
    <div className="overflow-hidden">
      <section
        className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden border-b bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/landing-black-hero-bg.webp')" }}
      >
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/landing-black-hero-bg.webp"
            alt="Black cinematic analytics background"
            fill
            priority
            className="object-cover opacity-95 brightness-125 contrast-110"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.48)_42%,rgba(0,0,0,0.06)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--background)_0%,rgba(0,0,0,0)_24%,rgba(0,0,0,0.12)_100%)]" />
        </motion.div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div className="max-w-4xl space-y-8">
            <Reveal>
              <Badge
                variant="outline"
                className="gap-2 bg-card/60 px-4 py-2 text-base backdrop-blur"
              >
                <Sparkles className="size-4 text-primary" aria-hidden />
                Problem-driven discovery for SaaS founders
              </Badge>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="space-y-6">
                <h1 className="text-6xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl 2xl:text-9xl">
                  Stop guessing. Start from the pain people already posted.
                </h1>
                <p className="max-w-3xl text-2xl leading-10 text-muted-foreground 2xl:text-3xl 2xl:leading-[3.25rem]">
                  Unsolved scans public frustration, clusters repeated needs,
                  and turns them into opportunity signals you can inspect,
                  validate, and act on.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-14 text-lg" asChild>
                  <Link href="/explora">
                    Open Explora
                    <ArrowRight className="size-5" aria-hidden />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 text-lg"
                  asChild
                >
                  <Link href="/reports">Preview B2B report</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="relative hidden lg:block">
              <motion.div
                style={{ y: signalY }}
                className="absolute -left-10 top-16 z-10 rounded-lg border bg-background/84 p-5 backdrop-blur-xl surface-glow"
              >
                <p className="text-base text-muted-foreground">Rising signal</p>
                <p className="mt-1 font-mono text-4xl font-semibold text-primary">
                  87
                </p>
                <p className="mt-1 text-base">Pain Score</p>
              </motion.div>
              <div className="relative overflow-hidden rounded-lg border bg-card/55 p-4 backdrop-blur-xl surface-glow">
                <Image
                  src="/images/responsive-analytics-devices.webp"
                  alt="AI evidence panel"
                  width={760}
                  height={860}
                  className="aspect-[4/5] rounded-md object-cover"
                  priority
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06}>
              <motion.div
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ duration: 0.25 }}
                className="rounded-lg border bg-card/70 p-7"
              >
                <div className="font-mono text-6xl font-semibold">
                  {stat.value}
                </div>
                <div className="mt-3 text-xl text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-lg font-medium text-primary">How it works</p>
            <h2 className="mt-3 text-5xl font-semibold leading-tight md:text-6xl">
              From scattered complaints to ranked opportunity.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <motion.div
                whileHover={{ y: -10, rotateX: 2 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="h-full bg-card/78">
                <CardHeader>
                  <span className="mb-3 grid size-14 place-items-center rounded-md bg-primary/12 text-primary">
                    <step.icon className="size-7" aria-hidden />
                  </span>
                  <CardTitle className="text-3xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xl leading-9">
                    {step.text}
                  </CardDescription>
                </CardContent>
              </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="space-y-20 py-8">
        {featureCards.map((feature, index) => (
          <Reveal key={feature.title}>
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
              <div className={index % 2 ? "lg:order-2" : ""}>
                <p className="text-lg font-medium text-primary">
                  0{index + 1}
                </p>
                <h2 className="mt-3 text-5xl font-semibold leading-tight md:text-6xl">
                  {feature.title}
                </h2>
                <p className="mt-5 max-w-xl text-2xl leading-10 text-muted-foreground">
                  {feature.text}
                </p>
                <div className="mt-8 grid gap-3 text-xl text-muted-foreground">
                  <span className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-primary" aria-hidden />
                    Source-backed summaries
                  </span>
                  <span className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-primary" aria-hidden />
                    Market saturation warnings
                  </span>
                  <span className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-primary" aria-hidden />
                    Founder validation loop
                  </span>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-14% 0px" }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.015 }}
                className="relative overflow-hidden rounded-lg border bg-card/60 p-3 backdrop-blur surface-glow"
              >
                <Image
                  src={feature.image}
                  alt={`${feature.title} visual`}
                  width={1100}
                  height={720}
                  className="aspect-[16/10] rounded-md object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </motion.div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg border bg-card/70 p-8 md:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_30%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_36%)]" />
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <p className="flex items-center gap-2 text-lg font-medium text-primary">
                <TrendingUp className="size-5" aria-hidden />
                Build from demand, not vibes
              </p>
              <h2 className="mt-4 text-5xl font-semibold leading-tight md:text-6xl">
                Explore the first SaaS pain map.
              </h2>
              <p className="mt-5 max-w-2xl text-2xl leading-10 text-muted-foreground">
                Explora now uses live public signals and arranges them as a
                horizontal board built for repeated product research sessions.
              </p>
            </div>
            <div className="grid gap-3">
              <Button size="lg" className="h-14 text-lg" asChild>
                <Link href="/explora">
                  Launch Explora
                  <Search className="size-5" aria-hidden />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 text-lg"
                asChild
              >
                <Link href="/dashboard">View founder dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
