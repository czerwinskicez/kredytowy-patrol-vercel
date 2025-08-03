import { getTreasuryBondOffers } from '@/lib/google-sheets';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const treasuryBondOffers = await getTreasuryBondOffers();
    return NextResponse.json(treasuryBondOffers);
  } catch (error) {
    console.error('Error fetching treasury bond offers:', error);
    return NextResponse.json([], { status: 500 });
  }
}