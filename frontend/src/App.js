import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={authToken ? <Navigate to="/" /> : <Login setAuthToken={setAuthToken} />}
        />
        <Route
          path="/"
          element={authToken ? <Home authToken={authToken} handleLogout={handleLogout} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
