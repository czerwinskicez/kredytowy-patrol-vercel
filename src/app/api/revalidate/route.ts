import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    )
    if (!isValidSignature) {
      return new Response('Invalid Signature', { status: 401 })
    }

    if (body?._type) {
      revalidateTag('sanity')
      return NextResponse.json({ revalidated: true, now: Date.now(), type: body._type })
    }

    return NextResponse.json({ revalidated: false, now: Date.now(), message: 'Missing body type' })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
} 