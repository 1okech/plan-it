import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AppHeader } from '@/components/AppHeader'
import { EventForm } from '@/components/EventForm'
import { getCurrentRA } from '@/lib/app-auth'

export default async function NewEventPage() {
  const ra = await getCurrentRA()
  if (!ra) redirect('/login')
  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <AppHeader ra={ra} />
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
        >
          ← Dashboard
        </Link>
        <div className="mt-8 rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_24px_70px_rgba(35,32,28,.07)] md:p-10">
          <p className="eyebrow w-fit">New event</p>
          <h1 className="mt-5 text-4xl font-bold tracking-[-.045em]">Plan something great.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Add the details residents need. We’ll handle the guest list and priority queue.
          </p>
          <div className="mt-9">
            <EventForm />
          </div>
        </div>
      </div>
    </main>
  )
}
