'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Calculator, User } from 'lucide-react'

const tabs = [
  { href: '/', label: 'home', icon: Home },
  { href: '/learn', label: 'learn', icon: BookOpen },
  { href: '/tools', label: 'tools', icon: Calculator },
  { href: '/profile', label: 'profile', icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)] bg-[var(--surface)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex min-h-16 items-stretch">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-120 ${
                isActive
                  ? 'text-base-blue'
                  : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
