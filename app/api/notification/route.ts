import { NextRequest, NextResponse } from 'next/server'
import { redis, keys, type UserRecord } from '@/lib/redis'

const MAX_NOTIFICATIONS_PER_HOUR_PER_USER = 5
const MAX_NOTIFICATIONS_PER_HOUR_GLOBAL = 500

// Supports two payload shapes:
// 1) MiniKit useNotification: { fid, notification: { notificationId, title, body, notificationDetails } }
// 2) Direct server call:      { fid, title, body, targetUrl?, notificationId? }
type ReqBody = {
  fid?: number
  title?: string
  body?: string
  targetUrl?: string
  notificationId?: string
  notification?: {
    notificationId?: string
    title?: string
    body?: string
    notificationDetails?: { url: string; token: string } | null
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload: ReqBody = await req.json()

    const fid = payload.fid
    const title = payload.title ?? payload.notification?.title
    const body = payload.body ?? payload.notification?.body
    const notificationId =
      payload.notificationId ?? payload.notification?.notificationId
    const targetUrl = payload.targetUrl

    if (!title || !body) {
      return NextResponse.json(
        { error: 'title and body required' },
        { status: 400 },
      )
    }
    if (title.length > 32 || body.length > 128) {
      return NextResponse.json(
        { error: 'title max 32, body max 128 chars' },
        { status: 400 },
      )
    }
    if (!fid || typeof fid !== 'number') {
      return NextResponse.json({ error: 'fid required' }, { status: 400 })
    }

    const user = (await redis.get(keys.user(fid))) as UserRecord | null
    if (!user?.notificationUrl || !user?.notificationToken) {
      return NextResponse.json(
        { error: 'user not registered' },
        { status: 404 },
      )
    }

    // Rate limit — per user per hour
    const hourBucket = Math.floor(Date.now() / 3_600_000).toString()
    const userKey = keys.rateLimit(fid, hourBucket)
    const userCount = await redis.incr(userKey)
    if (userCount === 1) await redis.expire(userKey, 3600)
    if (userCount > MAX_NOTIFICATIONS_PER_HOUR_PER_USER) {
      return NextResponse.json({ error: 'rate limited' }, { status: 429 })
    }

    // Rate limit — global per hour
    const globalKey = keys.globalRateLimit(hourBucket)
    const globalCount = await redis.incr(globalKey)
    if (globalCount === 1) await redis.expire(globalKey, 3600)
    if (globalCount > MAX_NOTIFICATIONS_PER_HOUR_GLOBAL) {
      return NextResponse.json(
        { error: 'global rate limited' },
        { status: 429 },
      )
    }

    const nid = notificationId ?? crypto.randomUUID()
    const appUrl =
      process.env.NEXT_PUBLIC_URL ?? 'https://learn-defi.vercel.app'

    try {
      const farcasterRes = await fetch(user.notificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.notificationToken}`,
        },
        body: JSON.stringify({
          notificationId: nid,
          title,
          body,
          targetUrl: targetUrl ?? appUrl,
          tokens: [user.notificationToken],
        }),
      })

      if (!farcasterRes.ok) {
        const text = await farcasterRes.text()
        console.error(
          '[notification] farcaster error',
          farcasterRes.status,
          text,
        )
        if (farcasterRes.status === 401 || farcasterRes.status === 403) {
          await Promise.all([
            redis.del(keys.user(fid)),
            redis.srem(keys.allUsers, fid.toString()),
          ])
        }
        return NextResponse.json(
          { error: 'notification failed' },
          { status: 502 },
        )
      }
    } catch (fetchErr) {
      console.error('[notification] fetch failed:', fetchErr)
      return NextResponse.json(
        { error: 'upstream fetch failed' },
        { status: 502 },
      )
    }

    await redis.set(keys.user(fid), { ...user, lastActive: Date.now() })

    return NextResponse.json({ ok: true, notificationId: nid })
  } catch (err) {
    console.error('[notification] error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
