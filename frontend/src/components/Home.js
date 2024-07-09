import React from 'react';
import EmailAnalytics from './EmailAnalytics';
import './Home.css';

const Home = ({ authToken, handleLogout }) => {
  return (
    <div className="home-container">
      <EmailAnalytics authToken={authToken} />
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
