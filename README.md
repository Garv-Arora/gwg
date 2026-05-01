# UdhariClub

> Settle trip expenses without the awkward "bhai paise bhej" conversation.

A mobile-first, no-login expense-splitting web app built for Indian friend
groups. Create a trip, share an invite link, add expenses, see the simplest
possible settlement plan, and ping the group on WhatsApp — that's it.

- **Stack** — Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase Postgres
- **Auth** — none for MVP; soft identity from a phone number stored in `localStorage`
- **Style** — dark fintech aesthetic, mint-green money accents, gold settlement highlights

## Quick start

```bash
# 1. Install
npm install

# 2. Set up the database
#    Open the Supabase SQL editor and run supabase/schema.sql

# 3. Configure env
cp .env.example .env.local
#    Fill in:
#      NEXT_PUBLIC_SUPABASE_URL
#      NEXT_PUBLIC_SUPABASE_ANON_KEY
#      SUPABASE_SERVICE_ROLE_KEY
#      NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Run
npm run dev
# → http://localhost:3000
```

## Project structure

```
supabase/schema.sql          # Postgres schema — run once in Supabase
src/app/                     # Next.js App Router pages + API routes
  page.tsx                   # Landing
  create/                    # Create a trip
  join/                      # Join with code; /join/[code] for deep links
  trip/[id]/                 # Trip dashboard, add/edit expense, settle, members
  api/                       # JSON API routes (server-only Supabase client)
src/components/              # AppShell, Card, Button, MoneyText, MemberChip, …
src/lib/
  supabase.ts                # Browser + server-role Supabase clients
  identity.ts                # Phone-based identity in localStorage
  settle.ts                  # Balance computation + settlement simplification
  expenseRepo.ts             # Insert/replace expense + splits in one call
  wa.ts                      # WhatsApp share message builders
  format.ts                  # ₹ formatting, relative time, avatar colors
src/types/                   # Shared TypeScript types
```

## How it works

### Identity, without auth

When a user creates or joins a trip, they enter a **phone number + name**.
The server upserts a row in `users` keyed on phone — same number across trips
gets the same `user.id` back. The client stores `{ user_id, phone, name }` in
`localStorage` so subsequent forms autofill.

There is no OTP, no Google login, no email. This is fine for an MVP shared
amongst friends because trips are only reachable via a 6-character invite
code.

### Settlement math

For each expense, the payer is credited the full amount and each split
participant is debited their share:

```
balance[payer]       += expense.amount
balance[participant] -= split.amount
```

A **positive** balance means the member should receive money. **Negative**
means they owe.

The simplification algorithm (`src/lib/settle.ts`) rounds every balance to
the nearest rupee, then repeatedly matches the largest debtor with the
largest creditor until everyone is within ₹1 of zero. This guarantees the
**minimum number of transfers** needed to clear all debts.

Once a transfer is marked settled, it's stored as a row in `settlements`
with `status = 'settled'` — those rows are folded back into the balance
computation, so the suggested transfer simply disappears from the list.

### WhatsApp sharing

All sharing uses `wa.me` deep links, no API or token. There are two flavors:

1. **Group plan** — a formatted list of "X → Y: ₹amount" lines plus the
   invite link. Opens WhatsApp with no recipient; the user picks the group.
2. **Personal reminder** — targeted at one member, includes their phone in
   the URL when known so it opens straight into their chat.

## Database

```
users           id, phone (unique), name
trips           id, name, emoji, invite_code (unique), created_by
trip_members    id, trip_id, user_id?, display_name, phone?
expenses        id, trip_id, payer_id, description, amount, split_type
expense_splits  id, expense_id, member_id, amount
settlements     id, trip_id, from_member, to_member, amount, status
```

RLS is enabled on all tables but the policies are intentionally permissive
for MVP — security comes from the unguessable invite code. **Tighten before
a real launch.**

## Design system

| Token            | Value     |
| ---------------- | --------- |
| Background       | `#0B0F14` |
| Card             | `#161C24` |
| Soft card        | `#1F2937` |
| Primary mint     | `#22C55E` |
| Gold accent      | `#FACC15` |
| Danger red       | `#EF4444` |
| Text primary     | `#F9FAFB` |
| Text secondary   | `#CBD5E1` |
| Text muted       | `#94A3B8` |
| Card radius      | 24px      |
| Input radius     | 16px      |
| Button shape     | pill      |
| Mobile max width | 430px     |

## Out of scope (intentionally)

OTP, Google login, payment gateways, the WhatsApp Cloud API, AI bill
scanning, PDF export, expense categories, subscriptions, native apps. This
is a focused MVP — add only after real usage demands it.

## Scripts

```bash
npm run dev       # start dev server on :3000
npm run build     # production build
npm run start     # serve production build
npm run lint      # next lint
npm run typecheck # tsc --noEmit
```
