import { NextRequest, NextResponse } from 'next/server'
import { redis, keys, type UserRecord } from '@/lib/redis'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fid, url, token, streak } = body

    if (typeof fid !== 'number' || !url || !token) {
      return NextResponse.json(
        { error: 'fid, url, and token are required' },
        { status: 400 },
      )
    }
    if (typeof url !== 'string' || typeof token !== 'string') {
      return NextResponse.json({ error: 'invalid types' }, { status: 400 })
    }

    const now = Date.now()
    const record: UserRecord = {
      fid,
      notificationUrl: url,
      notificationToken: token,
      addedAt: now,
      lastActive: now,
      streak: typeof streak === 'number' ? streak : 0,
      lastStreakCheck: now,
    }

    await Promise.all([
      redis.set(keys.user(fid), record),
      redis.sadd(keys.allUsers, fid.toString()),
    ])

    console.log('[frame-added] persisted fid:', fid)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[frame-added] error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
