import 'server-only';
import { google } from 'googleapis';
import type { LoanOffer, Logo } from '@/types';

const sheets = google.sheets('v4');

const sheetNameMapping: { [key: string]: string } = {
  'gotowkowy': 'Kredyt_Gotówkowy',
  'hipoteczny': 'Kredyt_Hipoteczny',
  'konsolidacyjny': 'Kredyt_Konsolidacyjny',
};

async function getAuth() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !privateKey) {
    throw new Error('Google Sheets API credentials are not set in environment variables.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth;
}

export async function getLogos(): Promise<Logo[]> {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = 'Logo!A2:B'; 

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => ({
        provider: row[0],
        logoURL: row[1],
      }));
    }
    return [];
  } catch (error) {
    console.error('API Error fetching logos:', error);
    return [];
  }
}

export async function getLoanOffers(loanType: string): Promise<LoanOffer[]> {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = sheetNameMapping[loanType];

    if (!spreadsheetId || !sheetName) {
      console.error('Spreadsheet ID or Sheet Name is missing.');
      return [];
    }

    const logos = await getLogos();
    const logoMap = new Map(logos.map(logo => [logo.provider, logo.logoURL]));

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:H`, // Assuming data is in columns A to H, starting from row 2
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const provider = row[0];
        const logoUrl = logoMap.get(provider) || '/trust.jpg'; // Use a default logo if not found
        
        return {
          provider: provider,
          baseInterestRate: parseFloat(row[1].replace(',', '.')),
          rrso: parseFloat(row[2].replace(',', '.')),
          commission: parseFloat(row[3].replace(',', '.')),
          name: row[4],
          maxLoanValue: parseInt(row[5], 10),
          maxLoanTime: parseInt(row[6], 10),
          representativeExample: row[7],
          logo: logoUrl,
        }
      });
    }

    // window.console.log(rows);

    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
} 