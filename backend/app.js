const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');
const { getAuthClient } = require('./config');
const fs = require('fs');
const path = require('path');
const TOKEN_PATH = path.join(__dirname, 'token.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/gmailAnalytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/emails', emailRoutes);
app.use('/api/auth', authRoutes); // Use auth routes

app.get('/', (req, res) => {
  res.send('Gmail Analytics API');
});

// this part was for manual server side authentication

// app.get('/oauth2callback', (req, res) => {
//   const code = req.query.code;
//   const oAuth2Client = getAuthClient();
//   oAuth2Client.getToken(code, (err, token) => {
//     if (err) return res.status(400).send('Error while trying to retrieve access token');
//     oAuth2Client.setCredentials(token);
//     // Store the token to disk for later program executions
//     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//       if (err) return console.error(err);
//       console.log('Token stored to', TOKEN_PATH);
//     });
//     res.send('Authorization successful');
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
