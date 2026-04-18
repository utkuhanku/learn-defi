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
      className="glass-bar fixed bottom-0 left-0 right-0 z-20 border-t border-[var(--border)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex min-h-16 items-stretch">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className="press relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors duration-150"
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className={
                  isActive
                    ? 'text-base-blue'
                    : 'text-white/40 hover:text-white/70'
                }
                style={
                  isActive
                    ? { filter: 'drop-shadow(0 0 8px rgba(0,0,255,0.4))' }
                    : undefined
                }
              />
              <span
                className={`text-xs font-medium tracking-[-0.01em] ${
                  isActive ? 'text-base-blue' : 'text-white/40'
                }`}
              >
                {label}
              </span>
              {/* active dot indicator */}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute top-1 h-1 w-1 rounded-full bg-base-blue"
                  style={{ boxShadow: '0 0 6px rgba(0,0,255,0.6)' }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
