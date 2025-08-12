import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  // --- Obsługa Webhooka z Sanity ---
  if (req.headers.has('sanity-hook-signature')) {
    try {
      const { body, isValidSignature } = await parseBody<{ _type: string }>(
        req,
        process.env.SANITY_REVALIDATE_SECRET
      )
      if (!isValidSignature) {
        return new Response('Invalid Sanity Signature', { status: 401 })
      }

      if (body?._type) {
        revalidateTag('sanity')
        return NextResponse.json({ revalidated: true, source: 'Sanity', now: Date.now(), type: body._type })
      }

      return NextResponse.json({ revalidated: false, source: 'Sanity', now: Date.now(), message: 'Missing body type' })
    } catch (error: any) {
      console.error('Error handling Sanity webhook:', error)
      return new Response(error.message, { status: 500 })
    }
  }

  // --- Obsługa rewalidacji z Google Sheets ---
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret === process.env.REVALIDATE_SECRET) {
    try {
      const body = await req.json()
      const { sheetName } = body
      if (!sheetName) {
        return NextResponse.json({ message: 'Sheet name is required' }, { status: 400 })
      }

      console.log(`Revalidation request from Google Sheets for: ${sheetName}`);

      const editedSheetToSlug: { [key: string]: string } = {
        'Kredyt_Gotówkowy': 'gotowkowy',
        'Kredyt_Hipoteczny': 'hipoteczny',
        'Kredyt_Konsolidacyjny': 'konsolidacyjny',
      };

      if (sheetName === 'ALL') {
        console.log('Revalidating ALL content: Sheets and Sanity...');
        revalidatePath('/', 'layout');
        revalidateTag('sanity');
      } else if (sheetName === 'Logo') {
        console.log('Revalidating all paths due to Logo sheet change...');
        revalidatePath('/', 'layout');
      } else {
        const slug = editedSheetToSlug[sheetName];
        if (slug) {
          revalidatePath(`/kredyty/${slug}`);
          if (slug === 'gotowkowy') {
            revalidatePath('/');
          }
        } else {
          // Domyślne rewalidowanie ścieżek, które nie mają dynamicznego sluga
          revalidatePath(`/${sheetName.toLowerCase()}`);
        }
      }
      return NextResponse.json({ revalidated: true, source: 'Google Sheets', now: Date.now() });
    } catch (err: any) {
      return NextResponse.json({ message: 'Error revalidating from Google Sheets', error: err.message }, { status: 500 });
    }
  }

  // --- Brak autoryzacji ---
  return NextResponse.json({ message: 'Invalid secret or signature' }, { status: 401 })
} 