import './App.css';
import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getUserData, GoogleAuth, login } from './services/firebaseConfig.js';
import Login from './components/Login';

function App() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    photoURL: '',
    uid: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user data is available in local storage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserData(userData);
      setIsAuthenticated(true);
      setUserName(userData.displayName || userData.email);
    } else {
      // No user data found in local storage
      console.log('No user data found in local storage.');
    }
  }, [userData]);

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
        setUserData(user);
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
      setUserData(user);
      // Store user data in local storage
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      alert(error.message);
    }
  };
  const handleLogout = () => {

    setIsAuthenticated(false);
    setUserData({
      email: '',
      password: '',
      photoURL: '',
      uid: '',
    });
    localStorage.removeItem('userData');
    localStorage.removeItem('userStatus');
  };
  return (
    <div className="App">
      {isAuthenticated ? (
        <div className="flex bg-red-400  rounded-lg p-1 m-1 font-mono items-center justify-start  text-lg">
          {userData.photoURL && (
            <div className="p-1 w-[20%] rounded-lg">
              <img src={userData.photoURL} alt="proPhoto" className="rounded-full" />
            </div>
          )}
          <div class=" w-full flex justify-between  items-center">
          <div className="flex flex-col text-base items-start">
            <h2>Welcome, {userName}</h2>
            <h3>{userData.email}</h3>
          </div>
          <button className="p-1 h-auto flex justify-end rounded-lg text-sm px-3 bg-rose-200 hover:text-gray-50 hover:bg-rose-500" onClick={()=>handleLogout()}>logout</button>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
