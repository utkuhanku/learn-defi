import { notFound } from 'next/navigation'
import { getModules, getLessons } from '@/lib/content'
import { ModuleContent } from './module-content'

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const modules = getModules()
  const mod = modules.find((m) => m.id === slug)
  if (!mod || mod.locked) notFound()

  const lessons = await getLessons(slug)

  return <ModuleContent module={mod} lessons={lessons} />
}
