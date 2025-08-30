import { NextRequest, NextResponse } from 'next/server';
import { validateTurnstileToken } from 'next-turnstile';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, clientMetadata, token } = body;

    // Validate Turnstile token
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Weryfikacja Cloudflare Turnstile nie powiodła się.' },
        { status: 400 }
      );
    }
    const turnstileVerified = await validateTurnstileToken(token);
    if (!turnstileVerified.success) {
      return NextResponse.json(
        { success: false, error: 'Weryfikacja Cloudflare Turnstile nie powiodła się.' },
        { status: 401 }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Adres e-mail jest wymagany.' },
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
    const firebaseResponse = await fetch(`${functionsUrl}/subscribeNewsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        serviceAccountKey,
        metadata
      }),
    });

    const firebaseData = await firebaseResponse.json();

    if (!firebaseResponse.ok) {
      return NextResponse.json(
        { success: false, error: firebaseData.error || 'Nie udało się zapisać do newslettera.' },
        { status: firebaseResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pomyślnie zapisano do newslettera.'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Wewnętrzny błąd serwera.' },
      { status: 500 }
    );
  }
}
