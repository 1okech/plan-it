import Link from 'next/link'

/**
 * Custom not-found page for the frontend.
 * This renders when `notFound()` is called from any page in the (frontend) route group.
 *
 * Customize this component to match your app's design and provide helpful navigation.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center bg-[var(--cream)] px-8 py-16 text-center">
      <span className="brand-mark">S</span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">We couldn&apos;t find that event.</h1>
      <p className="mt-4 text-[var(--muted)]">
        The link may be out of date, or the event may have been removed.
      </p>
      <Link className="button-primary mt-7" href="/">
        Back to Spotlight
      </Link>
    </main>
  )
}
