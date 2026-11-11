import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AppHeader } from '@/components/AppHeader'
import { CopyLinkButton } from '@/components/CopyLinkButton'
import { updateRSVPAction } from '@/app/(frontend)/actions'
import { Calendar, MapPin, UsersIcon } from '@/components/Icons'
import { asPayloadUser, getCurrentRA } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { formatEventDate, initials } from '@/lib/utils'

export default async function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const ra = await getCurrentRA()
  if (!ra) redirect('/login')
  const { id } = await params
  const payload = await getPayloadClient()
  let event
  try {
    event = await payload.findByID({
      collection: 'events',
      id,
      user: asPayloadUser(ra),
      overrideAccess: false,
    })
  } catch {
    notFound()
  }
  const { docs: rsvps } = await payload.find({
    collection: 'rsvps',
    where: { event: { equals: id } },
    sort: '-priorityScore,createdAt',
    limit: 500,
    user: asPayloadUser(ra),
    overrideAccess: false,
  })
  const going = rsvps.filter((rsvp) => rsvp.status === 'going')
  const waiting = rsvps.filter((rsvp) => rsvp.status === 'waitlisted')

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <AppHeader ra={ra} />
      <div className="mx-auto max-w-[1312px] px-6 py-10 md:px-10 lg:px-12">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← All events
        </Link>
        <div className="mt-7 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="card-kicker">{formatEventDate(event.startsAt)}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-[-.045em] md:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
              <span className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                {going.length}/{event.capacity} confirmed
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link className="button-ghost" href={`/e/${event.slug}`} target="_blank">
              Preview RSVP
            </Link>
            <CopyLinkButton path={`/e/${event.slug}`} />
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
              <div>
                <h2 className="font-bold">Priority queue</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Higher priority appears first. Every staff change is kept as a final override.
                </p>
              </div>
              <span className="rounded-full bg-[#f2eee7] px-3 py-1 text-xs font-bold">
                {rsvps.length} RSVPs
              </span>
            </div>
            {rsvps.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <UsersIcon className="mx-auto h-7 w-7 text-[#b8afa1]" />
                <h3 className="mt-4 font-bold">Waiting for the first RSVP</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Share the event link to start building the queue.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--line)]">
                {rsvps.map((rsvp, index) => (
                  <div
                    className="grid gap-4 px-5 py-4 md:grid-cols-[36px_1fr_auto] md:items-center"
                    key={rsvp.id}
                  >
                    <span className="text-center font-serif text-xl italic text-[var(--coral)]">
                      {index + 1}
                    </span>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee9ff] text-xs font-bold text-[#604ba1]">
                        {initials(rsvp.studentName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{rsvp.studentName}</p>
                        <p className="truncate text-xs text-[var(--muted)]">
                          {rsvp.studentEmail} · Priority {rsvp.priorityScore > 0 ? '+' : ''}
                          {rsvp.priorityScore}
                        </p>
                      </div>
                    </div>
                    <form
                      action={updateRSVPAction}
                      className="flex flex-wrap items-center gap-2 pl-12 md:pl-0"
                    >
                      <input type="hidden" name="id" value={String(rsvp.id)} />
                      <select
                        name="status"
                        defaultValue={rsvp.status}
                        aria-label={`Status for ${rsvp.studentName}`}
                      >
                        <option value="going">Going</option>
                        <option value="waitlisted">Waitlisted</option>
                        <option value="declined">Declined</option>
                      </select>
                      <select
                        name="attendance"
                        defaultValue={rsvp.attendance}
                        aria-label={`Attendance for ${rsvp.studentName}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="attended">Attended</option>
                        <option value="no-show">No show</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        className="text-xs font-bold text-[var(--coral)] hover:underline"
                        type="submit"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-[var(--pine)] p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9dc5ad]">
                Event health
              </p>
              <div className="mt-6 flex items-end justify-between">
                <strong className="text-5xl tracking-[-.05em]">
                  {Math.round((going.length / event.capacity) * 100)}%
                </strong>
                <span className="pb-1 text-xs text-white/55">capacity filled</span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--coral)]"
                  style={{ width: `${Math.min(100, (going.length / event.capacity) * 100)}%` }}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <strong className="text-xl">{going.length}</strong>
                  <p className="text-xs text-white/55">Going</p>
                </div>
                <div>
                  <strong className="text-xl">{waiting.length}</strong>
                  <p className="text-xs text-white/55">Waitlisted</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-[var(--line)] bg-white p-6">
              <Calendar className="h-5 w-5 text-[var(--coral)]" />
              <h3 className="mt-4 text-sm font-bold">After the event</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Mark who attended or didn’t show. That outcome automatically shapes priority at
                future events.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
