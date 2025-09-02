import 'server-only';
import { google } from 'googleapis';
import type { LoanOffer, Logo, DepositOffer, CurrencyDepositOffer, TreasuryBondOffer, SavingsAccountOffer, BusinessAccountOffer } from '@/types';
import { cache } from 'react';
import { unstable_cache as noStore } from 'next/cache';

const sheets = google.sheets('v4');

export const sheetNameMapping: { [key: string]: string } = {
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

export const getLogos = cache(async (): Promise<Logo[]> => {
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
});

export const getLoanOffers = noStore(
  async (loanType: string): Promise<LoanOffer[]> => {
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
      range: `${sheetName}!A1:M1`,
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

    // Check for essential columns, but don't require all
    if (columnIndex['provider'] === undefined) {
      console.error('Missing essential column: provider');
      return [];
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:M`, 
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
          url: row[columnIndex['url']] || '#',
        }
      });
    }

    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
},
['loanOffers', 'sheets'],
{
  tags: ['loanOffers', 'sheets'],
}
); 

export const getDepositOffers = noStore(
  async (): Promise<DepositOffer[]> => {
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
      range: `${sheetName}!A1:R1`,
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

    // Check for essential columns, but don't require all
    if (columnIndex['provider'] === undefined) {
      console.error('Missing essential column: provider');
      return [];
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:R`, 
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
          url: row[columnIndex['url']] || '#',
        }
      });
    }

    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
},
['depositOffers', 'sheets'],
{
  tags: ['depositOffers', 'sheets'],
}
);

export const getCurrencyDepositOffers = noStore(
  async (): Promise<CurrencyDepositOffer[]> => {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Lokaty_Walutowe';

    if (!spreadsheetId || !sheetName) {
      console.error('Spreadsheet ID or Sheet Name is missing.');
      return [];
    }

    const logos = await getLogos();
    const logoMap = new Map(logos.map(logo => [logo.provider, logo.logoURL]));

    const headerResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A1:I1`,
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

    // Check for essential columns, but don't require all
    if (columnIndex['provider'] === undefined) {
      console.error('Missing essential column: provider');
      return [];
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:I`, 
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const provider = row[columnIndex['provider']];
        const logoUrl = logoMap.get(provider) || '/trust.jpg';
        
        const promoted = row[columnIndex['promoted']] === 'TRUE';
        const hidden = row[columnIndex['hidden']] === 'TRUE';

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
          provider,
          currency: row[columnIndex['currency']] || 'EUR',
          baseInterestRate: parseNumericValue(row[columnIndex['baseInterestRate']], 0),
          name: row[columnIndex['name']] || '',
          minDepositValue: parseIntValue(row[columnIndex['minDepositValue']], 0),
          maxDepositValue: parseIntValue(row[columnIndex['maxDepositValue']], -1),
          period: parseIntValue(row[columnIndex['period']], 0),
          capitalization: parseIntValue(row[columnIndex['capitalization']], 0),
          url: row[columnIndex['url']] || '#',
          logo: logoUrl,
          promoted,
          hidden,
        };
      });
    }

    return [];
  } catch (error) {
    console.error('API Error fetching currency deposit offers:', error);
    return [];
  }
},
['currencyDepositOffers', 'sheets'],
{
  tags: ['currencyDepositOffers', 'sheets'],
}
);

export const getTreasuryBondOffers = noStore(
  async (): Promise<TreasuryBondOffer[]> => {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Obligacje_Skarbowe';

    if (!spreadsheetId || !sheetName) {
      console.error('Spreadsheet ID or Sheet Name is missing.');
      return [];
    }

    const headerResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A1:H1`,
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

    // Check for essential columns, but don't require all
    if (columnIndex['symbol'] === undefined) {
      console.error('Missing essential column: symbol');
      return [];
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:H`, 
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const parseNumericValue = (value: string | undefined, defaultValue: number = 0): number => {
          if (!value || value === '' || value === undefined) return defaultValue;
          const cleaned = value.toString().replace(',', '.').replace('%', '');
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        return {
          symbol: row[columnIndex['symbol']] || '',
          baseInterestRate: parseNumericValue(row[columnIndex['baseInterestRate']], 0),
          interestDescription: row[columnIndex['Interest_description']] || '',
          interestDescriptionV2: row[columnIndex['Interest_description_v2']] || '',
          interestDescriptionV3: row[columnIndex['Interest_description_v3']] || '',
          capitalization: row[columnIndex['capitalization']] || '',
          payday: row[columnIndex['payday']] || '',
          url: row[columnIndex['url']] || '#',
          promoted: false,
          hidden: false,
        };
      });
    }

    return [];
  } catch (error) {
    console.error('API Error fetching treasury bond offers:', error);
    return [];
  }
},
['treasuryBondOffers', 'sheets'],
{
  tags: ['treasuryBondOffers', 'sheets'],
}
);

export const getSavingsAccountOffers = noStore(
  async (): Promise<SavingsAccountOffer[]> => {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Konto_Oszczędnościowe';

    if (!spreadsheetId || !sheetName) {
      console.error('Spreadsheet ID or Sheet Name is missing.');
      return [];
    }

    const logos = await getLogos();
    const logoMap = new Map(logos.map(logo => [logo.provider, logo.logoURL]));

    const headerResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A1:G1`,
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

    // Check for essential columns, but don't require all
    if (columnIndex['provider'] === undefined) {
      console.error('Missing essential column: provider');
      return [];
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:G`,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const provider = row[columnIndex['provider']];
        const logoUrl = logoMap.get(provider) || '/trust.jpg';
        
        const promoted = row[columnIndex['promoted']] === 'TRUE';
        const hidden = row[columnIndex['hidden']] === 'TRUE';

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
          logo: logoUrl,
          name: row[columnIndex['name']] || '',
          baseInterestRate: parseNumericValue(row[columnIndex['baseInterestRate']], 0),
          maxDepositValue: parseIntValue(row[columnIndex['maxDepositValue']], 0),
          period: parseIntValue(row[columnIndex['period']], 0),
          accNeed: row[columnIndex['accNeed']] === 'tak',
          url: row[columnIndex['url']] || '#',
          promoted,
          hidden,
        }
      });
    }

    return [];
  } catch (error) {
    console.error('API Error fetching savings account offers:', error);
    return [];
  }
},
['savingsAccountOffers', 'sheets'],
{
  tags: ['savingsAccountOffers', 'sheets'],
}
);

export const getBusinessAccountOffers = noStore(
  async (): Promise<BusinessAccountOffer[]> => {
  try {
    const auth = await getAuth();
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Konta_Firmowe';

    if (!spreadsheetId || !sheetName) {
      console.error('Spreadsheet ID or Sheet Name is missing.');
      return [];
    }

    const logos = await getLogos();
    const logoMap = new Map(logos.map(logo => [logo.provider, logo.logoURL]));

    const headerResponse = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A1:L1`,
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

    // Check for essential columns, but don't require all
    if (columnIndex['provider'] === undefined) {
      console.error('Missing essential column: provider');
      return [];
    }

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: `${sheetName}!A2:L`,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      return rows.map(row => {
        const provider = row[columnIndex['provider']];
        const logoUrl = logoMap.get(provider) || '/trust.jpg';
        
        const promoted = row[columnIndex['promoted']] === 'TRUE';
        const hidden = row[columnIndex['hidden']] === 'TRUE';
        const extraLabel = row[columnIndex['extraLabel']] || '';

        const parseNumericValue = (value: string | undefined, defaultValue: number = 0): number => {
          if (!value || value === '' || value === undefined) return defaultValue;
          const cleaned = value.toString().replace(',', '.');
          const parsed = parseFloat(cleaned);
          return isNaN(parsed) ? defaultValue : parsed;
        };

        return {
          provider: provider,
          logo: logoUrl,
          accountFeeMin: parseNumericValue(row[columnIndex['accountFeeMin']], 0),
          accountFeeMax: parseNumericValue(row[columnIndex['accountFeeMax']], 0),
          cardFeeMin: parseNumericValue(row[columnIndex['cardFeeMin']], 0),
          cardFeeMax: parseNumericValue(row[columnIndex['cardFeeMax']], 0),
          atmWithdrawalMin: parseNumericValue(row[columnIndex['atmWithdrawalMin']], 0),
          atmWithdrawalMax: parseNumericValue(row[columnIndex['atmWithdrawalMax']], 0),
          bonus: parseNumericValue(row[columnIndex['bonus']], 0),
          promoted,
          hidden,
          extraLabel,
          url: row[columnIndex['url']] || '#',
        }
      });
    }

    return [];
  } catch (error) {
    console.error('API Error fetching business account offers:', error);
    return [];
  }
},
['businessAccountOffers', 'sheets'],
{
  tags: ['businessAccountOffers', 'sheets'],
}
);
