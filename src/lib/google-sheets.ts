import 'server-only';
import { google } from 'googleapis';
import type { LoanOffer, Logo, DepositOffer } from '@/types';

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

        // Bezpieczniejsze parsowanie wartości numerycznych
        const parseNumericValue = (value: string | undefined, defaultValue: number = 0): number => {
          if (!value || value === '' || value === undefined) return defaultValue;
          const cleaned = value.toString().replace(',', '.');
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        const parseIntValue = (value: string | undefined, defaultValue: number = 0): number => {
          if (!value || value === '' || value === undefined) return defaultValue;
          const parsed = parseInt(value, 10);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        return {
          provider: provider,
          baseInterestRate: parseNumericValue(row[columnIndex['baseInterestRate']], 0),
          rrso: parseNumericValue(row[columnIndex['rrso']], 0),
          commission: parseNumericValue(row[columnIndex['comission']], 0),
          name: row[columnIndex['name']] || '',
          maxLoanValue: parseIntValue(row[columnIndex['maxLoanValue']], 500000),
          maxLoanTime: parseIntValue(row[columnIndex['maxLoanTime']], 120),
          representativeExample: row[columnIndex['representativeExample']] || '',
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

export async function getDepositOffers(): Promise<DepositOffer[]> {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Lokata';

    if (!spreadsheetId || !sheetName) {
      console.error('Spreadsheet ID or Sheet Name is missing.');
      return [];
    }

    const logos = await getLogos();
    const logoMap = new Map(logos.map(logo => [logo.provider, logo.logoURL]));

    const headerResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A1:P1`,
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

    const requiredColumns = ['provider', 'baseInterestRate', 'name', 'minDepositValue', 'maxDepositValue', 'period'];
    for (const col of requiredColumns) {
      if (columnIndex[col] === undefined) {
        console.error(`Missing required column: ${col}`);
        return [];
      }
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:P`, 
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const provider = row[columnIndex['provider']];
        const logoUrl = logoMap.get(provider) || '/trust.jpg';
        
        const promoted = row[columnIndex['promoted']] === 'TRUE';
        const hidden = row[columnIndex['hidden']] === 'TRUE';
        const newClient = row[columnIndex['new']] === 'TRUE';
        const newMoney = row[columnIndex['newMoney']] === 'TRUE';
        const isOnline = row[columnIndex['isOnline']] === 'TRUE';
        const inApp = row[columnIndex['inApp']] === 'TRUE';
        const accNeed = row[columnIndex['accNeed']] === 'TRUE';
        const brakeUp = row[columnIndex['brakeUp']] === 'TRUE';

        // Bezpieczniejsze parsowanie wartości numerycznych
        const parseNumericValue = (value: string | undefined, defaultValue: number = 0): number => {
          if (!value || value === '' || value === undefined) return defaultValue;
          const cleaned = value.toString().replace(',', '.');
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        const parseIntValue = (value: string | undefined, defaultValue: number = 0): number => {
          if (!value || value === '' || value === undefined) return defaultValue;
          const parsed = parseInt(value, 10);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        return {
          provider: provider,
          baseInterestRate: parseNumericValue(row[columnIndex['baseInterestRate']], 0),
          name: row[columnIndex['name']] || '',
          minDepositValue: parseIntValue(row[columnIndex['minDepositValue']], 1000),
          maxDepositValue: parseIntValue(row[columnIndex['maxDepositValue']], 1000000),
          period: parseIntValue(row[columnIndex['period']], 12),
          new: newClient,
          newMoney: newMoney,
          isOnline: isOnline,
          inApp: inApp,
          accNeed: accNeed,
          capitalization: row[columnIndex['capitalization']] || '',
          brakeUp: brakeUp,
          safety: row[columnIndex['safety']] || '',
          logo: logoUrl,
          promoted,
          hidden,
        }
      });
    }

    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
} 