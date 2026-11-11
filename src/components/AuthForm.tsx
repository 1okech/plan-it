'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction, signupAction, type ActionState } from '@/app/(frontend)/actions'
import { ArrowRight } from './Icons'
import { SubmitButton } from './SubmitButton'

const initialState: ActionState = {}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const action = mode === 'login' ? loginAction : signupAction
  const [state, formAction] = useActionState(action, initialState)
  const signup = mode === 'signup'

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {signup && (
        <label className="field">
          <span>Full name</span>
          <input name="name" autoComplete="name" placeholder="Jordan Lee" required />
        </label>
      )}
      <label className="field">
        <span>Stanford email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="jordan@stanford.edu"
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          minLength={8}
          autoComplete={signup ? 'new-password' : 'current-password'}
          placeholder="At least 8 characters"
          required
        />
      </label>
      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton
        pendingLabel={signup ? 'Creating account…' : 'Signing in…'}
        className="button-primary w-full justify-center"
      >
        {signup ? 'Create RA account' : 'Sign in'} <ArrowRight className="h-4 w-4" />
      </SubmitButton>
      <p className="text-center text-sm text-[var(--muted)]">
        {signup ? 'Already have an account?' : 'Claiming one of the six RA accounts?'}{' '}
        <Link
          className="font-semibold text-[var(--ink)] underline decoration-[#d8d2c8] underline-offset-4"
          href={signup ? '/login' : '/signup'}
        >
          {signup ? 'Sign in' : 'Create account'}
        </Link>
      </p>
    </form>
  )
}
