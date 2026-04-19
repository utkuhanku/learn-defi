import { NextRequest, NextResponse } from 'next/server'
import { redis, keys } from '@/lib/redis'

type FrameEvent =
  | {
      event: 'frame_added'
      fid: number
      notificationDetails?: { url: string; token: string }
    }
  | { event: 'frame_removed'; fid: number }
  | {
      event: 'notifications_enabled'
      fid: number
      notificationDetails: { url: string; token: string }
    }
  | { event: 'notifications_disabled'; fid: number }

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FrameEvent
    console.log('[webhook]', body.event, 'fid:', body.fid)

    switch (body.event) {
      case 'frame_added':
      case 'notifications_enabled': {
        if (body.notificationDetails) {
          const existing = (await redis.get(keys.user(body.fid))) as
            | Record<string, unknown>
            | null
          const record = {
            ...(existing ?? {}),
            fid: body.fid,
            notificationUrl: body.notificationDetails.url,
            notificationToken: body.notificationDetails.token,
            addedAt:
              (existing?.addedAt as number | undefined) ?? Date.now(),
            lastActive: Date.now(),
          }
          await Promise.all([
            redis.set(keys.user(body.fid), record),
            redis.sadd(keys.allUsers, body.fid.toString()),
          ])
        }
        break
      }
      case 'frame_removed':
      case 'notifications_disabled': {
        await Promise.all([
          redis.del(keys.user(body.fid)),
          redis.srem(keys.allUsers, body.fid.toString()),
        ])
        break
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] error:', err)
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 })
  }
}
