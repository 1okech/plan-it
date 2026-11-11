'use server'

import { redirect } from 'next/navigation'
import { asPayloadUser, clearAppSession, getCurrentRA, setAppSession } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { slugify } from '@/lib/utils'

export type ActionState = { error?: string; success?: string }

const messageFrom = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.'

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'Enter your email and password.' }

  try {
    const payload = await getPayloadClient()
    const result = await payload.login({ collection: 'users', data: { email, password } })
    if (!result.token) return { error: 'Unable to start your session.' }
    await setAppSession(result.token)
  } catch {
    return { error: 'Email or password is incorrect.' }
  }
  redirect('/dashboard')
}

export async function signupAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (name.length < 2) return { error: 'Enter your full name.' }
  if (!email.endsWith('@stanford.edu')) return { error: 'Use your Stanford email.' }
  if (password.length < 8) return { error: 'Use at least 8 characters for your password.' }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      data: { name, email, password, role: 'ra' },
      overrideAccess: false,
    })
    const result = await payload.login({ collection: 'users', data: { email, password } })
    if (!result.token) return { error: 'Account created. Please sign in.' }
    await setAppSession(result.token)
  } catch (error) {
    return { error: messageFrom(error) }
  }
  redirect('/dashboard')
}

export async function logoutAction() {
  await clearAppSession()
  redirect('/')
}

export async function createEventAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ra = await getCurrentRA()
  if (!ra) return { error: 'Please sign in again.' }

  const title = String(formData.get('title') ?? '').trim()
  const location = String(formData.get('location') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const logistics = String(formData.get('logistics') ?? '').trim()
  const startsAt = String(formData.get('startsAt') ?? '')
  const endsAt = String(formData.get('endsAt') ?? '')
  const capacity = Number(formData.get('capacity'))

  if (!title || !location || !description || !startsAt) {
    return { error: 'Complete all required event details.' }
  }
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    return { error: 'Capacity must be between 1 and 500.' }
  }

  let eventID: string
  try {
    const payload = await getPayloadClient()
    const baseSlug = slugify(title)
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    const event = await payload.create({
      collection: 'events',
      data: {
        title,
        slug,
        location,
        description,
        logistics: logistics || undefined,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        capacity,
        status: 'published',
        createdBy: ra.id,
      },
      user: asPayloadUser(ra),
      overrideAccess: false,
    })
    eventID = String(event.id)
  } catch (error) {
    return { error: messageFrom(error) }
  }
  redirect(`/events/${eventID}`)
}

export async function rsvpAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const event = String(formData.get('event') ?? '')
  const studentName = String(formData.get('studentName') ?? '').trim()
  const studentEmail = String(formData.get('studentEmail') ?? '')
    .trim()
    .toLowerCase()
  const notes = String(formData.get('notes') ?? '').trim()

  if (!event || studentName.length < 2) return { error: 'Enter your full name.' }
  if (!studentEmail.endsWith('@stanford.edu')) {
    return { error: 'Use your Stanford email address.' }
  }

  try {
    const payload = await getPayloadClient()
    const result = await payload.create({
      collection: 'rsvps',
      data: { event, studentName, studentEmail, notes: notes || undefined } as never,
      overrideAccess: false,
    })
    const status =
      result.status === 'going'
        ? 'You’re on the guest list.'
        : 'You’re on the waitlist. Your place reflects your event history.'
    return { success: status }
  } catch (error) {
    const message = messageFrom(error)
    if (message.toLowerCase().includes('unique')) {
      return { error: 'You have already RSVP’d to this event.' }
    }
    return { error: message }
  }
}

export async function updateRSVPAction(formData: FormData) {
  const ra = await getCurrentRA()
  if (!ra) redirect('/login')

  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  const attendance = String(formData.get('attendance') ?? '')
  const allowedStatus = ['going', 'waitlisted', 'declined']
  const allowedAttendance = ['pending', 'attended', 'no-show', 'cancelled']
  if (!id || !allowedStatus.includes(status) || !allowedAttendance.includes(attendance)) {
    return
  }

  const payload = await getPayloadClient()
  await payload.update({
    collection: 'rsvps',
    id,
    data: {
      status: status as 'going' | 'waitlisted' | 'declined',
      attendance: attendance as 'pending' | 'attended' | 'no-show' | 'cancelled',
      manualOverride: true,
    },
    user: asPayloadUser(ra),
    overrideAccess: false,
  })
}
