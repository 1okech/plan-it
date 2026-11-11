# Plan It: Residential Event RSVP Manager

A fair way for Residential Assistants (RAs) to run event sign-ups, waitlists and attendance for their residents.

## The problem

RAs at Stanford plan and lead events both on and off campus, and most events have limited spots. Right now nobody tracks who gets waitlisted across events. One student can sign up for three events and be waitlisted for all three, while someone else gets into every one because they signed up a few minutes earlier. That isn't fair.

## The idea

Plan It uses a **priority queue** across events. If a student was waitlisted for one event, they move up the line for the next one. If a student already got into and attended an event, they move down for the next one. Spots are still filled automatically, but by priority first and signup time second, not by signup time alone.

The RA who creates an event always has the final say on who attends.

## How it works

1. **RAs log in.** The app is built for a team of RAs (currently 6). Each RA has their own account.
2. **Create an event.** Fill in the title, location, date and start/end time, description, logistics and other important information, and the number of spots.
3. **Share the RSVP link.** Each event gets a public link (`/e/<event-slug>`). Post it anywhere: group chats, email, Instagram, Slack. It works much like Partiful.
4. **Students RSVP** with their name and Stanford email (`@stanford.edu` only).
5. **Spots fill automatically by priority.** Students are ordered by priority score, then by signup time. The top students up to the spot count are marked **Going** and everyone else is **Waitlisted**. A low-priority student isn't placed ahead of a higher-priority one just because they signed up first.
6. **The RA decides the final list.** From the event page, the RA can move any student between Going and Waitlisted, and that manual choice is kept even when the queue rebalances.
7. **Track attendance.** After the event, the RA marks each student as Attended or No-show. This feeds back into everyone's priority for future events.

### Priority score

Each student's score comes from their history across all other events:

| History on another event | Effect on priority |
| --- | --- |
| Was waitlisted | +2 (moves up) |
| Attended | -1 (moves down) |
| No-show | -3 (moves down more) |

A higher score means a better place in line. Scores are recalculated whenever an RA updates a student's status or attendance.

## Features

**Built**
- RA sign-up and login
- Create events with title, location, start/end time, description, logistics and spot limit
- Event status: Published, Draft, Closed, Completed
- Shareable public RSVP page for each event
- Stanford-email-only RSVPs, one RSVP per student per event
- Automatic Going/Waitlisted assignment by priority score, then signup time
- RA overrides that stick, plus attendance tracking (Attended, No-show, Cancelled)
- RA dashboard listing events with attendee and waitlist tracking
- Admin panel (Payload CMS) at `/admin`

**Planned**
- Import event details from external sites
- Notifications to students when they move off the waitlist

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with React
- [Payload CMS](https://payloadcms.com/) for data, auth and the admin panel
- Tailwind CSS
- TypeScript

Originally generated with Figma Make.

## Project structure

```
src/
  app/(frontend)/       Public and RA-facing pages
    dashboard/          RA dashboard
    events/new/         Create an event
    events/[id]/        Manage one event's attendees and waitlist
    e/[slug]/           Public RSVP page students see
    login/, signup/     RA authentication
    actions.ts          Server actions (login, create event, RSVP, update RSVP)
  app/(payload)/        Payload admin panel and API routes
  collections/          Data models: Events, RSVPs, Users (RAs), Admins, Media
  components/           Shared UI (event form, RSVP form, copy-link button, header)
.figma/                 Figma Make config, keep it for re-importing into Figma
```

## Running locally

Requirements: Node 24 and pnpm 10 (see `.mise.toml`).

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

> **Note:** This app was built in Figma Make, and Figma Cloud provides its database, file storage and secrets through `@payloadcms/figma` (`buildFigmaConfig` in `src/payload.config.ts`). To run it fully outside Figma, you'll need to swap in standard Payload `buildConfig()` with your own database adapter (for example Postgres or MongoDB) and set a `PAYLOAD_SECRET` in a `.env` file. This hasn't been tested yet. Keep the `.figma/` folder if you want to import the repo back into Figma Make.
