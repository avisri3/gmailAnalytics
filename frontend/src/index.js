import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const CLIENT_ID = '24443638158-dvngvnrvgghkli5prqjftu749lotf4c8.apps.googleusercontent.com';

ReactDOM.render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
