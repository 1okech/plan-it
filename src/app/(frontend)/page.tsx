import Link from 'next/link'
import { ArrowRight, Calendar, Spark, UsersIcon } from '@/components/Icons'

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--cream)]">
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <span>Spotlight</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link className="button-ghost hidden sm:inline-flex" href="#how-it-works">
            How it works
          </Link>
          <Link className="button-secondary" href="/login">
            RA sign in
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-78px)] max-w-[1440px] items-center gap-12 px-6 py-16 md:px-10 lg:grid-cols-[1.02fr_.98fr] lg:px-16 lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <div className="eyebrow">
            <Spark className="h-4 w-4" /> Fair access to every event
          </div>
          <h1 className="mt-7 text-[clamp(3.5rem,7vw,7.2rem)] font-bold leading-[.88] tracking-[-.075em] text-[var(--ink)]">
            More events.
            <br />
            <span className="font-serif font-normal italic tracking-[-.045em] text-[var(--coral)]">
              Fairer spots.
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
            A shared event queue for Stanford residential teams. Students who missed out last time
            move forward next time—automatically.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link className="button-primary" href="/signup">
              Set up your RA team <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className="button-ghost" href="#how-it-works">
              See the priority system
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <span className="check-dot">✓</span> Six RA accounts
            </span>
            <span className="flex items-center gap-2">
              <span className="check-dot">✓</span> Stanford-only RSVP
            </span>
            <span className="flex items-center gap-2">
              <span className="check-dot">✓</span> Final staff control
            </span>
          </div>
        </div>

        <div className="relative min-h-[580px] lg:min-h-[680px]">
          <div className="hero-orbit" />
          <div className="hero-card absolute left-[4%] top-[5%] w-[82%] rotate-[-4deg] sm:left-[10%] sm:w-[72%]">
            <div className="flex items-start justify-between">
              <div>
                <p className="card-kicker">This Friday · 6:30 PM</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">Dim sum in the city</h2>
              </div>
              <span className="rounded-full bg-[#edf3ef] px-3 py-1 text-xs font-bold text-[var(--pine)]">
                12 spots
              </span>
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">
              <Calendar className="h-5 w-5 text-[var(--coral)]" />
              <span>Meet at Branner lobby</span>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs font-semibold">
                <span>Guest list</span>
                <span>10 / 12</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#ece8df]">
                <div className="h-full w-5/6 rounded-full bg-[var(--coral)]" />
              </div>
            </div>
          </div>
          <div className="hero-card absolute bottom-[13%] right-[1%] w-[74%] rotate-[5deg] bg-[var(--pine)] text-white sm:right-[3%] sm:w-[62%]">
            <p className="card-kicker text-[#afd1bd]">Priority queue</p>
            <div className="mt-5 space-y-3">
              {[
                ['1', 'Maya C.', 'Waitlisted last event', '+2'],
                ['2', 'Theo R.', 'First signup', '0'],
                ['3', 'Ari P.', 'Attended last event', '−1'],
              ].map(([rank, name, detail, score]) => (
                <div className="flex items-center gap-3 rounded-xl bg-white/8 p-3" key={name}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/12 text-xs font-bold">
                    {rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{name}</p>
                    <p className="truncate text-[11px] text-white/55">{detail}</p>
                  </div>
                  <span className="text-sm font-bold text-[#f6ad96]">{score}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-[3%] top-[4%] flex h-24 w-24 rotate-12 items-center justify-center rounded-full bg-[var(--yellow)] text-center text-xs font-extrabold uppercase leading-4 tracking-wider text-[var(--ink)] shadow-xl">
            Fair by
            <br />
            design
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="bg-[var(--ink)] px-6 py-24 text-white md:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-[1312px]">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow border-white/15 bg-white/5 text-white/70">How it works</p>
              <h2 className="mt-6 text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">
                A queue that remembers.
              </h2>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-3">
              {[
                [
                  '01',
                  'Create & share',
                  'Set capacity, logistics, and publish a simple RSVP link anywhere.',
                ],
                [
                  '02',
                  'Rank fairly',
                  'Prior waitlists raise priority. Attendance and no-shows adjust future position.',
                ],
                [
                  '03',
                  'Make the call',
                  'The queue recommends a guest list. RAs always have the final say.',
                ],
              ].map(([n, title, copy]) => (
                <div key={n} className="bg-[var(--ink)] p-8">
                  <span className="font-serif text-3xl italic text-[var(--coral)]">{n}</span>
                  <h3 className="mt-8 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
