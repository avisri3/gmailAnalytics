# Gmail Analytics

Gmail Analytics is a web application that analyzes a user's Gmail account, fetches emails, and displays various analytics in a user-friendly interface. The application consists of a frontend built with React and a backend built with Node.js and Express.
## Team
- Akshat Kumar
- Vishesh Gupta
- Riyanshi Agarwal
- Aviral Srivastava
  
## Features

- Google OAuth2 authentication
- Performs sentiment analysis on email subjects
- Displays email volume over time, top contacts, and sentiment distribution
- Interactive charts and modal dialogs for detailed analytics

## Technologies Used

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Google OAuth2
- Gmail API

### Frontend
- React

## Overview
- authController.js: Handles Google OAuth2 authentication.
- emailController.js: Fetches emails from Gmail, performs sentiment analysis, and stores emails in MongoDB.
- config.js: Provides the OAuth2 client configuration and token management.
- routes/authRoutes.js: Defines the route for Google authentication.
- routes/emailRoutes.js: Defines the routes for fetching emails and retrieving analytics data.
- models/Email.js: Defines the Mongoose schema for storing email data.
- app.js: Sets up the Express server, connects to MongoDB, and defines the API endpoints.
- App.js: Main application component that handles routing between login and home pages.
- components/Login.js: Handles user login using Google OAuth2.
- components/Home.js: Main dashboard component that includes the email analytics and logout button.
- components/EmailAnalytics.js: Fetches and displays email analytics data in various charts and modal dialogs.


