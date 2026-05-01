import Link from "next/link";
import { AppShell, Logo } from "@/components/AppShell";
import { Card } from "@/components/Card";
import { LinkButton } from "@/components/Button";
import { RecentTrips } from "@/components/RecentTrips";

export default function LandingPage() {
  return (
    <AppShell bare>
      <div className="mx-auto w-full max-w-[430px] px-4 pt-8 pb-12 min-h-[100dvh] flex flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display font-semibold text-ink-primary text-lg">
              UdhariClub
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-ink-muted">
            mvp
          </span>
        </header>

        <section className="mt-10">
          <span className="inline-flex items-center gap-2 rounded-pill bg-mint-soft px-3 py-1 text-[11px] uppercase tracking-widest text-mint border border-mint/30">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulseSoft" />
            Trip mode on
          </span>
          <h1 className="mt-5 font-display font-bold text-[40px] leading-[1.05] tracking-tight text-ink-primary">
            Settle trips without the
            <span className="block text-mint">awkward</span>
            <span className="text-gold">“bhai paise bhej”.</span>
          </h1>
          <p className="mt-4 text-ink-secondary leading-relaxed">
            Track group expenses, split fairly, and ping settlements on
            WhatsApp. No login, no spreadsheets, no drama.
          </p>

          <div className="mt-7 grid gap-3">
            <LinkButton href="/create" variant="primary" size="lg" full>
              Start a new trip
            </LinkButton>
            <LinkButton href="/join" variant="secondary" size="lg" full>
              Join with invite code
            </LinkButton>
          </div>
        </section>

        <section className="mt-10">
          <Hero />
        </section>

        <RecentTrips />

        <section className="mt-8 grid gap-3">
          <Feature
            emoji="🧮"
            title="Smart splits"
            body="Equal ya unequal — apni mehfil, apni shart."
          />
          <Feature
            emoji="🌿"
            title="Net balances, simplified"
            body="One-tap settlement plan with the fewest possible transfers."
          />
          <Feature
            emoji="💬"
            title="WhatsApp-first reminders"
            body="Send the awkward message — but make it pretty."
          />
        </section>

        <footer className="mt-12 pb-2 text-center text-xs text-ink-muted">
          Made with chai · <Link href="/create" className="text-mint">Try it</Link>
        </footer>
      </div>
    </AppShell>
  );
}

function Feature({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <Card variant="soft" className="flex items-start gap-3">
      <div className="h-10 w-10 grid place-items-center rounded-2xl bg-card text-xl">
        {emoji}
      </div>
      <div>
        <p className="font-display font-semibold text-ink-primary">{title}</p>
        <p className="text-sm text-ink-secondary mt-0.5">{body}</p>
      </div>
    </Card>
  );
}

function Hero() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-mint/30 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-wider text-ink-muted">
          Goa trip · 4 friends
        </p>
        <p className="mt-2 text-5xl font-display font-bold tracking-tight text-ink-primary">
          ₹18,420
        </p>
        <p className="mt-1 text-sm text-ink-muted">total spent</p>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Mini name="Aarav" amt="+1,250" tone="mint" />
          <Mini name="Riya" amt="−820" tone="danger" />
          <Mini name="Kabir" amt="−430" tone="danger" />
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-ink-muted">Settle in</span>
          <span className="text-mint font-semibold">2 transfers</span>
        </div>
      </div>
    </Card>
  );
}

function Mini({ name, amt, tone }: { name: string; amt: string; tone: "mint" | "danger" }) {
  return (
    <div className="rounded-2xl bg-soft/60 border border-white/[0.04] px-3 py-3">
      <p className="text-[11px] text-ink-muted uppercase tracking-wider">
        {name}
      </p>
      <p
        className={`mt-1 font-display font-semibold tabular-nums ${
          tone === "mint" ? "text-mint" : "text-danger"
        }`}
      >
        ₹{amt}
      </p>
    </div>
  );
}
