import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css';

const Login = ({ setAuthToken }) => {
  const handleLoginSuccess = async (response) => {
    const credential = response.credential;
    console.log('Login successful, credential:', credential);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { token: credential });
      console.log('Backend response:', res.data);
      localStorage.setItem('authToken', res.data.accessToken);
      setAuthToken(res.data.accessToken);
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  const handleLoginFailure = (response) => {
    console.error('Login failed', response);
  };

  return (
    <GoogleOAuthProvider clientId="24443638158-dvngvnrvgghkli5prqjftu749lotf4c8.apps.googleusercontent.com">
      <div className="login-container">
        <h2>Gmail Analytics</h2>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
