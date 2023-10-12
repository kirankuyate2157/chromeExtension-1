import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  getUserData,
  GoogleAuth,
  login,
  register
} from "../services/firebaseConfig.js"


export default function Login() {
  const [log, setLog] = useState();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    photoURL:'',
    uid:'',
  });

  const handleChange = (e) =>
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const Submit = async (e) => {
      e.preventDefault();
    
      if (!userData.email) {
        alert("Email is required!");
        return;
      }
      if (!userData.password) {
        alert("Password is required!");
        return;
      }
    
      try {
        const status = await login(userData.email, userData.password);
        if (status) {
          alert("Login successful!  refresh !");
          const dt = getUserData();
          if(dt)localStorage.setItem("userData",JSON.stringify(dt));
          localStorage.setItem("userStatus",JSON.stringify(true));
          const userStatus = localStorage.getItem("userStatus");
          console.log("user Status from login c : ",userStatus);
          
          setUserData(dt);

          console.log("Auth user: ", dt);
        }
        const data = getUserData();
        setLog(data);
        // console.log("Logged in user: ", data);
      } catch (error) {
        localStorage.setItem("userStatus",JSON.stringify(false));
        if (error.code === "Firebase: Error (auth/wrong-password).") {
          alert("Wrong password. Please check your password and try again.");
        } else if(error.message === "Firebase: Error (auth/user-not-found)."){
          alert("User not found. Please try again.");
        
      }else {
          alert("Login failed. access denied.");
          console.log(error.message);
        }
      }
    };

  const registerUser = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password || !userData.userName) {
      alert("Please fill all the required fields.");
    } else if (userData.password.length < 8) {
      alert("Password must be at least 8 characters.");
    } else {
      try {
        await register(userData.email, userData.password, userData.userName);
        alert("Account created successfully!");
      } catch (error) {
        alert(error.message);
      }
    }

    setUserData({
      userName: "",
      email: "",
      password: "",
    });
  };


  const googleLogin = async (e) => {
    e.preventDefault();
    try {
      await GoogleAuth();
      alert("Login successful with Google! refresh");
       const data=getUserData();
       if(data)localStorage.setItem("userData",JSON.stringify(data));
      localStorage.setItem("userStatus",JSON.stringify(true));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className='flex flex-row w-full p-20  bg-red-100 justify-center  align-middle'>
        <div className='inline-block w-full  bg-gray-100  p-5 max-w-md md:p-6 md:my-8 overflow-hidden text-left align-middle transition-all transform  shadow-md rounded-2xl'>
          <div className=' flex flex-col  w-full'>
            <form className='flex flex-col gap-3'>
            
            <div className=' w-full flex flex-col gap-2'>
                <input
                  type='text'
                  id='userName'
                  name='userName'
                  value={userData.userName}
                  onChange={handleChange}
                  placeholder='User Name..'
                  className='w-full border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500'
                />
              </div>
              <div className=' w-full flex flex-col gap-2'>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={userData.email}
                  onChange={handleChange}
                  placeholder='* email..'
                  className='w-full border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500'
                />
              </div>
              <div className=' w-full flex flex-col gap-2'>
                <input
                  type='password'
                  id='password'
                  placeholder=' * password..'
                  value={userData.password}
                  onChange={handleChange}
                  name='password'
                  className='w-full border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500'
                />
              </div>
              <div
                onClick={(e) => {
                  Submit(e);
                }}
                className='w-full  text-center bg-blue-400 text-white border border-gray-500  hover:bg-blue-500 py-2 rounded-xl'
              >
                Sign In
              </div>
              <div
                onClick={(e) => {
                  registerUser(e);
                }}
                className='w-full  text-center bg-blue-400 text-white border border-gray-500  hover:bg-blue-500 py-2 rounded-xl'
              >
                Sign Up
              </div>
              <div className='w-full text-center '>Or</div>
              <button
                onClick={(e) => googleLogin(e)}
                className='py-2 justify-center   bg-blue-400 text-white rounded-xl flex items-center gap-2 w-full border border-bcc-500  hover:bg-blue-500'
              >
                <FcGoogle className='bg-transparent' />
                Login With Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
