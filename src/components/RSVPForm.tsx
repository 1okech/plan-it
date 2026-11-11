'use client'

import { useActionState } from 'react'
import { rsvpAction, type ActionState } from '@/app/(frontend)/actions'
import { SubmitButton } from './SubmitButton'

const initialState: ActionState = {}

export function RSVPForm({ eventID }: { eventID: string }) {
  const [state, action] = useActionState(rsvpAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-2xl bg-[#e8f3ed] p-6">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pine)] text-white">
          ✓
        </div>
        <h3 className="text-lg font-bold text-[var(--pine)]">RSVP received</h3>
        <p className="mt-2 text-sm leading-6 text-[#315a47]">{state.success}</p>
        <p className="mt-4 text-xs text-[#587263]">
          Your RA team can make final changes to the guest list.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="event" value={eventID} />
      <label className="field">
        <span>Full name</span>
        <input name="studentName" autoComplete="name" placeholder="Your name" required />
      </label>
      <label className="field">
        <span>Stanford email</span>
        <input
          name="studentEmail"
          type="email"
          autoComplete="email"
          placeholder="you@stanford.edu"
          required
        />
      </label>
      <label className="field">
        <span>
          Note for the RAs <em>optional</em>
        </span>
        <textarea name="notes" rows={2} placeholder="Accessibility needs, dietary restrictions…" />
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton
        pendingLabel="Saving your spot…"
        className="button-primary w-full justify-center"
      >
        RSVP to this event
      </SubmitButton>
      <p className="text-center text-[11px] leading-5 text-[var(--muted)]">
        Your spot is based on capacity and your event participation history, not just signup time.
      </p>
    </form>
  )
}
