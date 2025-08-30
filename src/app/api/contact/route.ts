import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, consent, clientMetadata } = body;

    // Validate required fields
    if (!name || !email || !subject || !message || !consent) {
      return NextResponse.json(
        { success: false, error: 'Proszę wypełnić wszystkie wymagane pola.' },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof name !== 'string' || typeof email !== 'string' || 
        typeof subject !== 'string' || typeof message !== 'string' ||
        typeof consent !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format danych.' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (phone && typeof phone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format numeru telefonu.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy format adresu e-mail.' },
        { status: 400 }
      );
    }

    // Validate consent
    if (!consent) {
      return NextResponse.json(
        { success: false, error: 'Zgoda jest wymagana.' },
        { status: 400 }
      );
    }

    // Combine client and server metadata
    const metadata = {
      ...clientMetadata,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      vercelIpCountry: request.headers.get('x-vercel-ip-country') || 'unknown',
      headers: {
        'accept-language': request.headers.get('accept-language') || 'unknown',
        'host': request.headers.get('host') || 'unknown',
      }
    };

    // Reconstruct service account key from environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    // Validate that all parts of the service account key are present
    if (!serviceAccount.project_id || !serviceAccount.private_key_id || !serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.client_id || !serviceAccount.client_x509_cert_url) {
      console.error('Firebase service account key is incomplete in environment variables');
      return NextResponse.json(
        { success: false, error: 'Błąd konfiguracji serwera.' },
        { status: 500 }
      );
    }
    
    const serviceAccountKey = JSON.stringify(serviceAccount);


    // Get Firebase Functions URL from environment variables
    const functionsUrl = process.env.FIREBASE_FUNCTIONS_URL;
    if (!functionsUrl) {
      console.error('Firebase Functions URL not found in environment variables');
      return NextResponse.json(
        { success: false, error: 'Błąd konfiguracji serwera.' },
        { status: 500 }
      );
    }

    // Call Firebase Function
    const firebaseResponse = await fetch(`${functionsUrl}/submitContactForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        consent,
        serviceAccountKey,
        metadata
      }),
    });

    const firebaseData = await firebaseResponse.json();

    if (!firebaseResponse.ok) {
      return NextResponse.json(
        { success: false, error: firebaseData.error || 'Nie udało się wysłać formularza.' },
        { status: firebaseResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Formularz został pomyślnie wysłany.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Wewnętrzny błąd serwera.' },
      { status: 500 }
    );
  }
}
