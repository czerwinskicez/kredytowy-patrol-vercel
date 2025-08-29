import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint do rewalidacji treści z Sanity.
 * Wywoływany przez webhook z Sanity za pomocą metody GET.
 * Autoryzacja odbywa się przez parametry `secret` i `tag` w URL.
 * Przykład: /api/revalidate?tag=sanity&secret=...
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const tag = req.nextUrl.searchParams.get('tag')

  if (tag === 'sanity' && secret === process.env.SANITY_REVALIDATE_SECRET) {
    try {
      console.log("Revalidating 'sanity' tag based on GET request.")
      revalidateTag('sanity')
      return NextResponse.json({ revalidated: true, source: 'Sanity (via GET)', now: Date.now() })
    } catch (error: any) {
      console.error('Error handling Sanity GET webhook:', error)
      return NextResponse.json({ message: 'Error revalidating from Sanity', error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Invalid secret or tag for GET request' }, { status: 401 })
}


/**
 * Endpoint do rewalidacji treści z Google Sheets.
 * Wywoływany przez Google Apps Script za pomocą metody POST.
 * Autoryzacja odbywa się przez parametr `secret` w URL.
 * W ciele (`body`) żądania przekazywana jest nazwa edytowanego arkusza.
 */
export async function POST(req: NextRequest) {
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

  return NextResponse.json({ message: 'Invalid secret for POST request' }, { status: 401 })
} 