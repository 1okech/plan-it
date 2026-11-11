import 'server-only'

import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import type { User } from '@/payload-types'

const SESSION_COOKIE = 'app-session'

export type CurrentRA = {
  id: string
  name: string
  email: string
}

export function asPayloadUser(ra: CurrentRA): User {
  return {
    ...ra,
    role: 'ra',
    collection: 'users',
    createdAt: '',
    updatedAt: '',
  }
}

export async function getCurrentRA(): Promise<CurrentRA | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null

  const payload = await getPayloadClient()
  const authHeaders = new Headers({ Authorization: `JWT ${token}` })
  const { user } = await payload.auth({ headers: authHeaders })
  if (!user || user.collection !== 'users') return null

  return {
    id: user.id,
    name: String(user.name ?? 'RA'),
    email: String(user.email),
  }
}

export async function setAppSession(token: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAppSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
