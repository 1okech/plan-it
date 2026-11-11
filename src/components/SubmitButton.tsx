'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton({
  children,
  pendingLabel = 'Working…',
  className = '',
}: {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} className={className} type="submit">
      {pending ? pendingLabel : children}
    </button>
  )
}
