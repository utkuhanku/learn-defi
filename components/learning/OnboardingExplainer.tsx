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
    <section className="px-6 pb-10">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
        how it works
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gray-15 dark:bg-gray-80">
              <step.icon size={20} strokeWidth={1.5} className="text-gray-60 dark:text-gray-30" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
