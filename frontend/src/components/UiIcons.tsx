type IconProps = {
  className?: string
}

export function ArrowRightIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 10h9" />
      <path d="M11 6l4 4-4 4" />
    </svg>
  )
}

export function CheckIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10.5l3.2 3.2L16 5.5" />
    </svg>
  )
}

export function WarningIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3.5l7 12H3L10 3.5z" />
      <path d="M10 8v3.5" />
      <path d="M10 14.5h.01" />
    </svg>
  )
}

export function CircleDotIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" />
    </svg>
  )
}

export function EmptyIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H13l3 3v7.5A2.5 2.5 0 0 1 13.5 17h-7A2.5 2.5 0 0 1 4 14.5v-8z" />
      <path d="M13 4v3h3" />
    </svg>
  )
}

export function UserSearchIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8" cy="7" r="2.5" />
      <path d="M4.5 15a3.5 3.5 0 0 1 7 0" />
      <circle cx="14.5" cy="13.5" r="1.8" />
      <path d="M16.1 15.1l1.4 1.4" />
    </svg>
  )
}

export function FinanceIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 6h12v8H4z" />
      <path d="M7 9.5h6" />
      <path d="M10 7.5v5" />
    </svg>
  )
}

export function TechIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M7 4h6v4H7z" />
      <path d="M6 8h8v6H6z" />
      <path d="M8 14v2h4v-2" />
      <path d="M8 10h.01M10 10h.01M12 10h.01" />
    </svg>
  )
}

export function ShieldLockIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3l5 2v4c0 3.6-2.2 6.2-5 8-2.8-1.8-5-4.4-5-8V5l5-2z" />
      <path d="M8.5 9.5A1.5 1.5 0 0 1 10 8a1.5 1.5 0 0 1 1.5 1.5V11H8.5V9.5z" />
      <path d="M8 11h4v3H8z" />
    </svg>
  )
}

export function SupportIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 7.5A5 5 0 0 1 15 7.5v3a5 5 0 0 1-5 5H8l-3 2v-2.8A5 5 0 0 1 5 10.5v-3z" />
      <path d="M8 9.5h4M8 12h2.5" />
    </svg>
  )
}

