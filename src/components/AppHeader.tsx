import Link from 'next/link'
import { logoutAction } from '@/app/(frontend)/actions'
import { Plus } from './Icons'
import { initials } from '@/lib/utils'
import type { CurrentRA } from '@/lib/app-auth'

export function AppHeader({ ra }: { ra: CurrentRA }) {
  return (
    <header className="app-header">
      <Link href="/dashboard" className="brand">
        <span className="brand-mark">S</span>
        <span>Spotlight</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/events/new" className="button-primary hidden sm:inline-flex">
          <Plus className="h-4 w-4" /> New event
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white p-1 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pine)] text-[11px] font-bold text-white">
            {initials(ra.name)}
          </span>
          <span className="hidden text-xs font-bold sm:inline">{ra.name}</span>
        </div>
        <form action={logoutAction}>
          <button className="button-ghost px-3" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
