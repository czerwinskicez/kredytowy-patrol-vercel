const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cors = require("cors");

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

          const {email, serviceAccountKey, metadata} = req.body;

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
