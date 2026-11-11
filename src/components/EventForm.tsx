'use client'

import { useActionState } from 'react'
import { createEventAction, type ActionState } from '@/app/(frontend)/actions'
import { ArrowRight } from './Icons'
import { SubmitButton } from './SubmitButton'

const initialState: ActionState = {}

export function EventForm() {
  const [state, action] = useActionState(createEventAction, initialState)
  return (
    <form action={action} className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field sm:col-span-2">
          <span>Event title</span>
          <input name="title" placeholder="Dim sum in the city" required />
        </label>
        <label className="field">
          <span>Location</span>
          <input name="location" placeholder="Meet at Branner lobby" required />
        </label>
        <label className="field">
          <span>Number of spots</span>
          <input name="capacity" type="number" min="1" max="500" defaultValue="12" required />
        </label>
        <label className="field">
          <span>Starts</span>
          <input name="startsAt" type="datetime-local" required />
        </label>
        <label className="field">
          <span>
            Ends <em>optional</em>
          </span>
          <input name="endsAt" type="datetime-local" />
        </label>
        <label className="field sm:col-span-2">
          <span>Description</span>
          <textarea
            name="description"
            rows={4}
            placeholder="What should residents expect?"
            required
          />
        </label>
        <label className="field sm:col-span-2">
          <span>
            Logistics <em>optional</em>
          </span>
          <textarea
            name="logistics"
            rows={3}
            placeholder="What to bring, transportation, cost, accessibility…"
          />
        </label>
      </div>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
        <p className="max-w-md text-xs leading-5 text-[var(--muted)]">
          The event will be published immediately. Priority ranking applies automatically as
          students RSVP.
        </p>
        <SubmitButton pendingLabel="Publishing…" className="button-primary shrink-0">
          Publish event <ArrowRight className="h-4 w-4" />
        </SubmitButton>
      </div>
    </form>
  )
}
