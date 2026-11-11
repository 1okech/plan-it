'use client'

import { useState } from 'react'
import { Copy } from './Icons'

export function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="button-secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(`${window.location.origin}${path}`)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }}
    >
      <Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy RSVP link'}
    </button>
  )
}
