import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'
import { getCurrentRA } from '@/lib/app-auth'

export default async function SignupPage() {
  if (await getCurrentRA()) redirect('/dashboard')
  return (
    <main className="auth-shell">
      <Link href="/" className="brand absolute left-6 top-6 md:left-10 md:top-9">
        <span className="brand-mark">S</span>
        <span>Spotlight</span>
      </Link>
      <section className="auth-card">
        <p className="eyebrow mx-auto w-fit">Team setup</p>
        <h1 className="mt-5 text-center text-4xl font-bold tracking-[-.045em]">
          Claim your RA account.
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-[var(--muted)]">
          Your team has six spots. Use a Stanford email to join.
        </p>
        <AuthForm mode="signup" />
      </section>
    </main>
  )
}
