import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, UsersIcon } from '@/components/Icons'
import { RSVPForm } from '@/components/RSVPForm'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { formatEventDate } from '@/lib/utils'

export default async function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await findBySlug('events', slug, { depth: 0 })
  if (!event || event.status === 'draft') notFound()

  const payload = await getPayloadClient()
  const going = await payload.count({
    collection: 'rsvps',
    where: { and: [{ event: { equals: event.id } }, { status: { equals: 'going' } }] },
    overrideAccess: true,
  })
  const spotsLeft = Math.max(0, event.capacity - going.totalDocs)

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <span>Spotlight</span>
        </Link>
        <span className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
          Stanford Residential Life
        </span>
      </header>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:px-10 lg:grid-cols-[1fr_390px] lg:gap-16 lg:py-20">
        <section>
          <p className="eyebrow w-fit">
            {event.status === 'closed' ? 'RSVPs closed' : 'You’re invited'}
          </p>
          <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[.98] tracking-[-.055em] sm:text-6xl">
            {event.title}
          </h1>
          <p className="mt-7 max-w-2xl whitespace-pre-line text-lg leading-8 text-[var(--muted)]">
            {event.description}
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="detail-tile">
              <Calendar className="h-5 w-5 text-[var(--coral)]" />
              <div>
                <span>When</span>
                <strong>{formatEventDate(event.startsAt)}</strong>
              </div>
            </div>
            <div className="detail-tile">
              <MapPin className="h-5 w-5 text-[var(--coral)]" />
              <div>
                <span>Where</span>
                <strong>{event.location}</strong>
              </div>
            </div>
            <div className="detail-tile">
              <UsersIcon className="h-5 w-5 text-[var(--coral)]" />
              <div>
                <span>Capacity</span>
                <strong>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Waitlist open'}</strong>
              </div>
            </div>
          </div>
          {event.logistics && (
            <div className="mt-9 rounded-2xl border border-[var(--line)] bg-white/55 p-6">
              <h2 className="text-sm font-bold">Good to know</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--muted)]">
                {event.logistics}
              </p>
            </div>
          )}
          <div className="mt-10 border-t border-[var(--line)] pt-7">
            <h2 className="text-sm font-bold">How spots are assigned</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Spotlight considers who was waitlisted and who attended previous events. Signup time
              breaks ties, and your RA team reviews the final guest list.
            </p>
          </div>
        </section>
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-[0_20px_65px_rgba(35,32,28,.09)] md:p-8">
            <p className="card-kicker">Reserve your place</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              {spotsLeft > 0 ? 'Join the guest list' : 'Join the waitlist'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              No account needed. Use your Stanford email so we can keep the queue fair.
            </p>
            <div className="mt-7">
              {event.status === 'published' ? (
                <RSVPForm eventID={String(event.id)} />
              ) : (
                <p className="rounded-xl bg-[#f2eee7] p-4 text-sm text-[var(--muted)]">
                  RSVPs are closed for this event.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
