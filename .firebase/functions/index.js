const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cors = require("cors");
const {google} = require("googleapis");

setGlobalOptions({maxInstances: 10});

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize CORS with specific origin
const corsHandler = cors({
  origin: true,
  credentials: true,
});

/**
 * Helper function to validate service account credentials
 * @param {string} serviceAccountKey - JSON string of service account
 * @return {boolean} - Whether the service account is valid
 */
function validateServiceAccount(serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return serviceAccount.type === "service_account" &&
           serviceAccount.project_id &&
           serviceAccount.private_key_id &&
           serviceAccount.private_key &&
           serviceAccount.client_email;
  } catch (error) {
    return false;
  }
}

// Newsletter subscription function
exports.subscribeNewsletter = onRequest(
    {region: "europe-central2"},
    (req, res) => {
      corsHandler(req, res, async () => {
        try {
          // Only allow POST requests
          if (req.method !== "POST") {
            return res.status(405).json({
              success: false,
              error: "Method not allowed",
            });
          }

          const {email, name, serviceAccountKey, metadata} = req.body;

          // Validate required fields
          if (!email || !serviceAccountKey || !metadata) {
            return res.status(400).json({
              success: false,
              error: "Adres e-mail jest wymagany.",
            });
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return res.status(400).json({
              success: false,
              error: "Nieprawidłowy format adresu e-mail.",
            });
          }

          // Validate service account credentials
          if (!validateServiceAccount(serviceAccountKey)) {
            return res.status(401).json({
              success: false,
              error: "Nieprawidłowe poświadczenia konta serwisowego.",
            });
          }

          const db = admin.firestore();
          const newsletterRef = db.collection("newsletter_subscriptions");

          const existingSubscription = await newsletterRef
              .where("email", "==", email)
              .limit(1)
              .get();

          if (!existingSubscription.empty) {
            return res.status(409).json({
              success: false,
              error: "Ten adres e-mail jest już zapisany.",
            });
          }

          // Add new subscription
          const subscriptionData = {
            email: email.toLowerCase(),
            name: name ? name.trim() : null,
            subscribed: true,
            metadata: {
              ...metadata,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            },
            type: "newsletter",
          };

          await newsletterRef.add(subscriptionData);

          logger.info("Newsletter subscription added", {
            email: email.toLowerCase(),
          });

          res.status(200).json({
            success: true,
            message: "Pomyślnie zapisano do newslettera.",
          });
        } catch (error) {
          logger.error("Error in subscribeNewsletter:", error);
          res.status(500).json({
            success: false,
            error: "Wewnętrzny błąd serwera.",
          });
        }
      });
    });

// Contact form submission function
exports.submitContactForm = onRequest(
    {region: "europe-central2"},
    (req, res) => {
      corsHandler(req, res, async () => {
        try {
          // Only allow POST requests
          if (req.method !== "POST") {
            return res.status(405).json({
              success: false,
              error: "Method not allowed",
            });
          }

          const {
            name, email, phone, subject, message,
            consent, serviceAccountKey, metadata,
          } = req.body;

          // Validate required fields
          if (
            !name || !email || !subject || !message ||
            !consent || !serviceAccountKey || !metadata
          ) {
            return res.status(400).json({
              success: false,
              error: "Proszę wypełnić wszystkie wymagane pola.",
            });
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return res.status(400).json({
              success: false,
              error: "Nieprawidłowy format adresu e-mail.",
            });
          }

          // Validate consent
          if (consent !== true) {
            return res.status(400).json({
              success: false,
              error: "Zgoda jest wymagana.",
            });
          }

          // Validate service account credentials
          if (!validateServiceAccount(serviceAccountKey)) {
            return res.status(401).json({
              success: false,
              error: "Nieprawidłowe poświadczenia konta serwisowego.",
            });
          }

          // Save to Firestore
          const db = admin.firestore();
          const contactRef = db.collection("contact_submissions");

          const contactData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : null,
            subject: subject.trim(),
            message: message.trim(),
            consent: true,
            metadata: {
              ...metadata,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            },
            type: "contact_form",
            status: "new",
          };

          await contactRef.add(contactData);

          logger.info("Contact form submission added", {
            email: email.toLowerCase().trim(),
            subject: subject.trim(),
          });

          res.status(200).json({
            success: true,
            message: "Formularz został pomyślnie wysłany.",
          });
        } catch (error) {
          logger.error("Error in submitContactForm:", error);
          res.status(500).json({
            success: false,
            error: "Wewnętrzny błąd serwera.",
          });
        }
      });
    });

// Google Sheets configuration and helpers
const SPREADSHEET_ID = "1oOlhHgZt03_8z_MVRZTvDGm6dRr82kU-P6ZJDW20q4c";

/**
 * Get authenticated Google Sheets client using ADC
 * @return {object} Google Sheets API client
 */
function getSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({version: "v4", auth});
  } catch (error) {
    logger.error("Error creating Google Sheets client:", error);
    throw error;
  }
}

/**
 * Append a row to specific Google Sheets tab
 * @param {string} sheetName - Name of the sheet tab
 * @param {Array} values - Array of values to append
 */
async function appendRowToSheet(sheetName, values) {
  try {
    const sheets = getSheetsClient();
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [values],
      },
    });
    logger.info(`Row appended to ${sheetName}`, {
      range: result.data.updates.updatedRange,
      rows: result.data.updates.updatedRows,
    });
    return result;
  } catch (error) {
    logger.error(`Error appending to ${sheetName}:`, error);
    // Don't throw - let the function continue even if Sheets fails
    return null;
  }
}

// Firestore trigger: Newsletter subscription created
exports.onNewsletterCreated = onDocumentCreated({
  document: "newsletter_subscriptions/{docId}",
  region: "europe-central2",
}, async (event) => {
  try {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data in newsletter document");
      return;
    }

    const data = snapshot.data();
    logger.info("Newsletter subscription trigger fired",
        {docId: event.params.docId},
    );

    // Prepare row data for Google Sheets
    const metadata = data.metadata || {};
    const headers = metadata.headers || {};
    const rowData = [
      new Date().toISOString(), // Timestamp
      data.name || "",
      data.email || "",
      metadata.ip || "",
      metadata.vercelIpCountry || "",
      headers["accept-language"] || "",
      headers.host || "",
      data.type || "newsletter",
      "NEW", // Status
    ];

    // Append to Newsletter sheet
    const sheetsResult = await appendRowToSheet("Newsletter", rowData);

    // Mark as synced to sheets
    const updateData = {
      sheetSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (sheetsResult) {
      updateData.sheetsSyncSuccess = true;
    } else {
      updateData.sheetsSyncSuccess = false;
    }
    await snapshot.ref.update(updateData);

    logger.info("Newsletter subscription synced to Google Sheets", {
      docId: event.params.docId,
      email: data.email,
    });
  } catch (error) {
    logger.error("Error in onNewsletterCreated:", error);
    // Don't throw - we don't want to fail the trigger
  }
});

// Firestore trigger: Contact form submission created
exports.onContactCreated = onDocumentCreated({
  document: "contact_submissions/{docId}",
  region: "europe-central2",
}, async (event) => {
  try {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn("No data in contact document");
      return;
    }

    const data = snapshot.data();
    logger.info("Contact submission trigger fired",
        {docId: event.params.docId},
    );

    // Prepare row data for Google Sheets
    const metadata = data.metadata || {};
    const headers = metadata.headers || {};
    const rowData = [
      new Date().toISOString(), // Timestamp
      data.name || "",
      data.email || "",
      data.phone || "",
      data.subject || "",
      data.message || "",
      data.consent ? "TRUE" : "FALSE",
      metadata.ip || "",
      metadata.vercelIpCountry || "",
      headers["accept-language"] || "",
      headers.host || "",
      data.status || "new",
    ];

    // Append to Kontakt sheet
    const sheetsResult = await appendRowToSheet("Kontakt", rowData);

    // Mark as synced to sheets
    const updateData = {
      sheetSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (sheetsResult) {
      updateData.sheetsSyncSuccess = true;
    } else {
      updateData.sheetsSyncSuccess = false;
    }
    await snapshot.ref.update(updateData);

    logger.info("Contact submission synced to Google Sheets", {
      docId: event.params.docId,
      email: data.email,
      subject: data.subject,
    });
  } catch (error) {
    logger.error("Error in onContactCreated:", error);
    // Don't throw - we don't want to fail the trigger
  }
});
