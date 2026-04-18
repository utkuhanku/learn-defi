import { BookOpen, Calculator, Zap } from 'lucide-react'

const steps = [
  {
    icon: BookOpen,
    title: 'learn by playing',
    description: 'swipe through bite-sized lessons, no textbook vibes.',
  },
  {
    icon: Calculator,
    title: 'real calculators',
    description: 'impermanent loss, health factor, APR→APY — plug in your numbers.',
  },
  {
    icon: Zap,
    title: 'earn xp on base',
    description: 'complete modules, pass quizzes, collect badges.',
  },
] as const

export function OnboardingExplainer() {
  return (
    <section className="px-6 pb-12">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-dim)]">
        how it works
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="glass flex items-start gap-4 rounded-md p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white/[0.05]">
              <step.icon
                size={20}
                strokeWidth={1.5}
                className="text-white/60"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
