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

    const headerResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A1:K1`,
    });

    const headers = headerResponse.data.values?.[0];
    if (!headers) {
      console.error('Sheet headers are missing.');
      return [];
    }

    const columnIndex: { [key: string]: number } = {};
    headers.forEach((header, index) => {
      columnIndex[header] = index;
    });

    const requiredColumns = ['provider', 'baseInterestRate', 'rrso', 'comission', 'name', 'maxLoanValue', 'maxLoanTime', 'representativeExample'];
    for (const col of requiredColumns) {
      if (columnIndex[col] === undefined) {
        console.error(`Missing required column: ${col}`);
        return [];
      }
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:K`, 
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const provider = row[columnIndex['provider']];
        const logoUrl = logoMap.get(provider) || '/trust.jpg';
        
        const promoted = row[columnIndex['promoted']] === 'TRUE';
        const hidden = row[columnIndex['hidden']] === 'TRUE';
        const extraLabel = row[columnIndex['extraLabel']] || '';

        return {
          provider: provider,
          baseInterestRate: parseFloat(row[columnIndex['baseInterestRate']].replace(',', '.')),
          rrso: parseFloat(row[columnIndex['rrso']].replace(',', '.')),
          commission: parseFloat(row[columnIndex['comission']].replace(',', '.')),
          name: row[columnIndex['name']],
          maxLoanValue: parseInt(row[columnIndex['maxLoanValue']], 10),
          maxLoanTime: parseInt(row[columnIndex['maxLoanTime']], 10),
          representativeExample: row[columnIndex['representativeExample']],
          logo: logoUrl,
          promoted,
          hidden,
          extraLabel,
        }
      });
    }

    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
} 