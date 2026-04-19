import { NextRequest, NextResponse } from 'next/server'
import { redis, keys, type UserRecord } from '@/lib/redis'

const STREAK_AT_RISK_THRESHOLD_MS = 20 * 3_600_000
const STREAK_REMINDER_MAX_WINDOW_MS = 26 * 3_600_000

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const fids = await redis.smembers(keys.allUsers)
    console.log('[cron] streak-reminder — checking', fids.length, 'users')

    const now = Date.now()
    let sent = 0
    const appUrl =
      process.env.NEXT_PUBLIC_URL ?? 'https://learn-defi.vercel.app'

    for (const fidStr of fids) {
      const fid = parseInt(fidStr, 10)
      if (isNaN(fid)) continue

      const user = (await redis.get(keys.user(fid))) as UserRecord | null
      if (!user?.notificationUrl || !user?.notificationToken) continue

      const streak = user.streak ?? 0
      const lastActive = user.lastActive ?? user.addedAt
      const sinceActive = now - lastActive

      if (
        streak >= 1 &&
        sinceActive >= STREAK_AT_RISK_THRESHOLD_MS &&
        sinceActive < STREAK_REMINDER_MAX_WINDOW_MS
      ) {
        try {
          const res = await fetch(user.notificationUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.notificationToken}`,
            },
            body: JSON.stringify({
              notificationId: `streak-${fid}-${Math.floor(now / 86_400_000)}`,
              title: `${streak}-day streak 🔥`,
              body: `keep it alive — complete a lesson today`,
              targetUrl: appUrl,
              tokens: [user.notificationToken],
            }),
          })
          if (res.ok) {
            sent++
          } else if (res.status === 401 || res.status === 403) {
            await Promise.all([
              redis.del(keys.user(fid)),
              redis.srem(keys.allUsers, fidStr),
            ])
          }
        } catch (err) {
          console.error('[cron] send failed for fid:', fid, err)
        }
      }
    }

    return NextResponse.json({ ok: true, checked: fids.length, sent })
  } catch (err) {
    console.error('[cron] error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
