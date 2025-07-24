import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  // 1. Sprawdź, czy sekretny token jest poprawny
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  // 2. Pobierz nazwę arkusza z ciała żądania
  const body = await request.json()
  const { sheetName } = body
  if (!sheetName) {
    return NextResponse.json({ message: 'Sheet name is required' }, { status: 400 })
  }

  const editedSheetToSlug: { [key: string]: string } = {
    'Kredyt_Gotówkowy': 'gotowkowy',
    'Kredyt_Hipoteczny': 'hipoteczny',
    'Kredyt_Konsolidacyjny': 'konsolidacyjny',
  };

  // 3. Zdecyduj, które ścieżki odświeżyć
  try {
    if (sheetName === 'Logo') {
      // Jeśli zmienią się loga, odświeżamy wszystko
      console.log('Revalidating all paths due to Logo sheet change...');
      revalidatePath('/');
      revalidatePath('/kredyty/gotowkowy');
      revalidatePath('/kredyty/hipoteczny');
      revalidatePath('/kredyty/konsolidacyjny');
    } else {
      const slug = editedSheetToSlug[sheetName];
      if (slug) {
        // Odśwież stronę danego kredytu
        console.log(`Revalidating path: /kredyty/${slug}`);
        revalidatePath(`/kredyty/${slug}`);
        
        // Strona główna pokazuje kredyty gotówkowe, więc ją też odświeżamy
        if (slug === 'gotowkowy') {
          console.log('Revalidating path: /');
          revalidatePath('/');
        }
      } else {
         return NextResponse.json({ message: `No path configured for sheet: ${sheetName}` }, { status: 400 });
      }
    }
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message: 'Error revalidating', error: errorMessage }, { status: 500 });
  }
} 