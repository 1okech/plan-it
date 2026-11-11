import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/AppHeader'
import { ArrowRight, Calendar, Plus, UsersIcon } from '@/components/Icons'
import { asPayloadUser, getCurrentRA } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { formatEventDate } from '@/lib/utils'

export default async function DashboardPage() {
  const ra = await getCurrentRA()
  if (!ra) redirect('/login')

  const payload = await getPayloadClient()
  const { docs: events } = await payload.find({
    collection: 'events',
    sort: 'startsAt',
    limit: 100,
    user: asPayloadUser(ra),
    overrideAccess: false,
  })
  const { docs: rsvps } = await payload.find({
    collection: 'rsvps',
    limit: 500,
    user: asPayloadUser(ra),
    overrideAccess: false,
  })
  const now = Date.now()
  const upcoming = events.filter((event) => new Date(event.startsAt).getTime() >= now)
  const totalGoing = rsvps.filter((rsvp) => rsvp.status === 'going').length
  const totalWaitlisted = rsvps.filter((rsvp) => rsvp.status === 'waitlisted').length

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <AppHeader ra={ra} />
      <div className="mx-auto max-w-[1312px] px-6 py-10 md:px-10 lg:px-12 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-[var(--coral)]">Residential life</p>
            <h1 className="mt-2 text-4xl font-bold tracking-[-.045em] md:text-5xl">
              Good morning, {ra.name.split(' ')[0]}.
            </h1>
            <p className="mt-3 text-[var(--muted)]">
              Here’s what’s happening with your community events.
            </p>
          </div>
          <Link href="/events/new" className="button-primary sm:hidden">
            <Plus className="h-4 w-4" /> New event
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ['Upcoming events', upcoming.length, 'bg-[#ebe2ff]'],
            ['Confirmed spots', totalGoing, 'bg-[#dceee4]'],
            ['On waitlists', totalWaitlisted, 'bg-[#ffe2d9]'],
          ].map(([label, value, color]) => (
            <div className="stat-card" key={String(label)}>
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <p className="ml-3 text-sm font-semibold text-[var(--muted)]">{label}</p>
              <strong className="ml-auto text-3xl tracking-tight">{value}</strong>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Upcoming events</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Guest lists update as residents RSVP.
              </p>
            </div>
          </div>
          {upcoming.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-[#cfc7b9] bg-white/45 px-6 py-16 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Calendar className="h-5 w-5 text-[var(--coral)]" />
              </span>
              <h3 className="mt-5 text-lg font-bold">Your calendar is wide open</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
                Create your first event, set a capacity, then share its RSVP link with residents.
              </p>
              <Link href="/events/new" className="button-primary mt-6">
                <Plus className="h-4 w-4" /> Create first event
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {upcoming.map((event) => {
                const eventRSVPs = rsvps.filter(
                  (rsvp) =>
                    (typeof rsvp.event === 'object' ? rsvp.event.id : rsvp.event) === event.id,
                )
                const going = eventRSVPs.filter((rsvp) => rsvp.status === 'going').length
                const waiting = eventRSVPs.filter((rsvp) => rsvp.status === 'waitlisted').length
                return (
                  <Link className="event-card group" href={`/events/${event.id}`} key={event.id}>
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="card-kicker">{formatEventDate(event.startsAt)}</p>
                        <h3 className="mt-2 text-xl font-bold tracking-tight group-hover:text-[var(--coral)]">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted)]">{event.location}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="mt-7 flex items-center gap-5 border-t border-[var(--line)] pt-5 text-xs font-semibold text-[var(--muted)]">
                      <span className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" /> {going}/{event.capacity} going
                      </span>
                      <span>{waiting} waitlisted</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
