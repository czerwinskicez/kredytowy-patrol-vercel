import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint do rewalidacji treści.
 * Obsługuje zarówno Sanity.io (tag=sanity) jak i Google Sheets (sheetName parameter).
 * Autoryzacja odbywa się przez parametry `secret` i `tag`/`sheetName` w URL.
 * Przykłady: 
 * - Sanity: /api/revalidate?tag=sanity&secret=...
 * - Google Sheets: /api/revalidate?sheetName=Kredyt_Gotówkowy&secret=...
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const tag = req.nextUrl.searchParams.get('tag')
  const sheetName = req.nextUrl.searchParams.get('sheetName')

  // Obsługa Sanity.io webhook
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

  // Obsługa Google Sheets webhook
  if (sheetName && secret === process.env.REVALIDATE_SECRET) {
    try {
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
      return NextResponse.json({ revalidated: true, source: 'Google Sheets (via GET)', now: Date.now() });
    } catch (err: any) {
      return NextResponse.json({ message: 'Error revalidating from Google Sheets', error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Invalid secret, tag, or sheetName for GET request' }, { status: 401 })
}

 