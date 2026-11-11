import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
export function Calendar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
    </svg>
  )
}
export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-1a2.5 2.5 0 0 1 0 5m3 5v-1a3 3 0 0 0-2-2.83" />
    </svg>
  )
}
export function MapPin(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
export function Plus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
export function Spark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.3 4.1a5.2 5.2 0 0 0 3.4 3.4L21 12l-4.3 1.5a5.2 5.2 0 0 0-3.4 3.4L12 21l-1.3-4.1a5.2 5.2 0 0 0-3.4-3.4L3 12l4.3-1.5a5.2 5.2 0 0 0 3.4-3.4L12 3Z" />
    </svg>
  )
}
export function Copy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  )
}
