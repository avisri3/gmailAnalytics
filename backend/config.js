const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const getAuthClient = () => {
  console.log('Reading credentials from CREDENTIALS_PATH:', CREDENTIALS_PATH);
  const content = fs.readFileSync(CREDENTIALS_PATH);
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    console.log('Reading token from TOKEN_PATH:', TOKEN_PATH);
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    console.log('Token set in OAuth2 client:', token);
  } else {
    console.log('No token found at TOKEN_PATH:', TOKEN_PATH);
  }

  return oAuth2Client;
};

const authenticateGoogle = () => {
  const oAuth2Client = getAuthClient();
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  console.log('Authorize this app by visiting this url:', authUrl);
};

module.exports = { getAuthClient, authenticateGoogle };
