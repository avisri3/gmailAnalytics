const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const TOKEN_PATH = path.join(__dirname, '../token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

const CLIENT_ID = '24443638158-dvngvnrvgghkli5prqjftu749lotf4c8.apps.googleusercontent.com';

const authenticateGoogle = async (req, res) => {
  const { token } = req.body;

  console.log('Received credential:', token);

  try {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log('Token payload:', payload);

    const { name, email, picture } = payload;

    res.status(200).json({ accessToken: token, user: { name, email, picture } });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateGoogle };
