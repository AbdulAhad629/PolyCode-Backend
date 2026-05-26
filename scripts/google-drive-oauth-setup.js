/**
 * One-time setup: get a Google Drive OAuth refresh token for personal Gmail.
 *
 * Before running:
 * 1. Google Cloud Console → APIs → enable Google Drive API
 * 2. OAuth consent screen → configure (External is fine for testing)
 * 3. Credentials → Create OAuth client ID → "Web application"
 * 4. Authorized redirect URI: http://localhost:3333/oauth2callback
 * 5. Set in .env (or pass when prompted):
 *    GOOGLE_DRIVE_OAUTH_CLIENT_ID=...
 *    GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=...
 *
 * Run from backend folder:
 *   node scripts/google-drive-oauth-setup.js
 */
require("dotenv").config();
const http = require("http");
const { URL } = require("url");
const { google } = require("googleapis");

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = "https://www.googleapis.com/auth/drive.file";

const clientId = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET?.trim();

if (!clientId || !clientSecret) {
  console.error(
    "\nMissing GOOGLE_DRIVE_OAUTH_CLIENT_ID or GOOGLE_DRIVE_OAUTH_CLIENT_SECRET in .env\n",
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  REDIRECT_URI,
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: [SCOPE],
  prompt: "consent",
});

console.log("\n=== Google Drive OAuth setup (personal Gmail) ===\n");
console.log("1. Open this URL in your browser and sign in:\n");
console.log(authUrl);
console.log("\n2. Allow access. You will be redirected to localhost.\n");

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname !== "/oauth2callback") {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(`<h1>Authorization failed: ${error}</h1>`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h1>Missing authorization code</h1>");
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>Success!</h1><p>You can close this tab and return to the terminal.</p>",
    );

    console.log("\n=== Add these lines to backend/.env ===\n");
    console.log(`GOOGLE_DRIVE_OAUTH_CLIENT_ID=${clientId}`);
    console.log(`GOOGLE_DRIVE_OAUTH_CLIENT_SECRET=${clientSecret}`);
    console.log(`GOOGLE_DRIVE_OAUTH_REDIRECT_URI=${REDIRECT_URI}`);
    console.log(`GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("\n=== Folder ===\n");
    console.log(
      "Create a folder in YOUR Google Drive (the same Gmail you signed in with).",
    );
    console.log(
      "Copy its ID from the URL into GOOGLE_DRIVE_FOLDER_ID=...\n",
    );
    console.log(
      "You can remove or comment out GOOGLE_DRIVE_CREDENTIALS_PATH (service account).\n",
    );
    console.log("Restart the backend, then try uploading a profile photo again.\n");

    server.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<h1>Error: ${err.message}</h1>`);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Waiting for redirect on ${REDIRECT_URI} ...\n`);
});
