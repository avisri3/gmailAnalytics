const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const Email = require('../models/Email');
const { getAuthClient } = require('../config');

const TOKEN_PATH = path.join(__dirname, '../token.json');
//refreshes token if expired
const refreshTokenIfNeeded = async (oAuth2Client) => {
  console.log('Checking if token needs refresh...');
  if (!oAuth2Client.credentials || !oAuth2Client.credentials.access_token) {
    console.log('No access token set.');
    throw new Error('No access token set.');
  }

  if (oAuth2Client.credentials.expiry_date <= Date.now()) {
    try {
      console.log('Refreshing token...');
      const { credentials } = await oAuth2Client.refreshAccessToken();
      oAuth2Client.setCredentials(credentials);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
      console.log('Token refreshed:', credentials);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw new Error('Failed to refresh token');
    }
  } else {
    console.log('Token is valid and does not need refresh.');
  }
};

const fetchEmails = async (req, res) => {
  const auth = getAuthClient();
  const gmail = google.gmail({ version: 'v1', auth });
  let emailDetails = [];
  let nextPageToken = null;
  let totalEmailsFetched = 0;
  const maxEmails = 1000; 
// by default gmail api gives 100 emails at once
// implemented pagination to get 1000 emails by calling api again . store in array and push to db
//currently not working, as we are getting ID token instead of access token.
  try {
    console.log('Reading token from TOKEN_PATH:', TOKEN_PATH);
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    console.log('Token content:', token);
    auth.setCredentials(token);

    await refreshTokenIfNeeded(auth);

    do {
      console.log('Fetching emails, page token:', nextPageToken);
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 100,
        pageToken: nextPageToken,
      });

      console.log('Response received:', response.data);
      if (response.data.messages) {
        const messages = await Promise.all(
          response.data.messages.map(async (message) => {
            const msg = await gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full',
            });
            const payload = msg.data.payload;
            const headers = payload.headers.reduce((acc, header) => {
              acc[header.name.toLowerCase()] = header.value;
              return acc;
            }, {});

            return {
              from: headers.from,
              to: headers.to,
              date: headers.date,
              subject: headers.subject,
              snippet: msg.data.snippet,
            };
          })
        );

        totalEmailsFetched += messages.length;
        emailDetails = emailDetails.concat(messages);
        console.log('Fetched emails:', messages.length);
      }

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken && totalEmailsFetched < maxEmails);

    await Email.insertMany(emailDetails);
    res.status(200).json({ message: 'Emails fetched and saved successfully!', totalEmailsFetched });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

const getEmailAnalytics = async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching email analytics:', error);
    res.status(500).json({ error: 'Failed to fetch email analytics' });
  }
};

module.exports = { fetchEmails, getEmailAnalytics };
