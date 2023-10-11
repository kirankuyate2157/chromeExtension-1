import './App.css';
import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getUserData, GoogleAuth, login } from './services/firebaseConfig.js';
import Login from './components/Login';

function App() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check the user's authentication status when the component loads
    const checkAuthStatus = async () => {
      const user = getUserData();
      if (user) {
        // User is authenticated
        setIsAuthenticated(true);
        setUserName(user.displayName || user.email);
      }
    };

    checkAuthStatus();
  }, []);

  const handleChange = (e) =>
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!userData.email) {
      alert('Email is required!');
    }
    if (!userData.password) {
      alert('Password is required!');
    }

    try {
      const status = await login(userData.email, userData.password);
      if (status) {
        alert('Login successful!');
        const user = getUserData();
        setIsAuthenticated(true);
        setUserName(user.displayName || user.email);

        // Store user data in local storage
        localStorage.setItem('userData', JSON.stringify(user));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      await GoogleAuth();
      alert('Login successful with Google!');
      const user = getUserData();
      setIsAuthenticated(true);
      setUserName(user.displayName || user.email);

      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      alert(error.message);
    }
  };

  // Check for user data in local storage when the component loads
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setIsAuthenticated(true);
      setUserName(userData.displayName || userData.email);
    } else {
      // If no user data found, perform Google login
      googleLogin();
    }
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {userName}</h2>
          {/* Add your extension content here */}
        </div>
      ) : (
        <Login
          userData={userData}
          handleChange={handleChange}
          submit={submit}
          googleLogin={googleLogin}
        />
      )}
    </div>
  );
}

export default App;
