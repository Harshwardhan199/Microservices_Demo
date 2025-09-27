import { useState } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginSignup, setLoginSignup] = useState(true);

  const [email, setEmail] = useState("harsh@gmail.com");
  const [password, setPassword] = useState("qwer");

  const [accessToken, setaccessToken] = useState("dsfst");
  const [refreshToken, setrefreshToken] = useState("");

  const [userEmail, setUserEmail] = useState();

  const handleLogin = async () => {

    try {
      const res = await axios.post("http://127.0.0.1:8080/login/", {email, password});

      //console.log("RefreshToken: ", res.data.refresh);
      //console.log("AccessToken: ", res.data.access);
      
      // setaccessToken(res.data.access);
      // setrefreshToken(res.data.refresh);

      // console.log(res);
      
      console.log(res.data.accessToken);
      console.log(res.data.user.email);
      
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
    
  };

  const handleSignUp = async() => {

    try {
      const res = await axios.post("http://127.0.0.1:8080/register/", {email, password});
      setLoginSignup(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const getUserData = async() => {
    try {
      const res = await axios.post("http://127.0.0.1:8080/getData/", {accessToken});
      console.log(res.data);

      setUserEmail(res.data.email);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex justify-center items-center h-screen w-screen '>

      <div className='p-2 rounded-xl bg-gray-100'>
        {!isLoggedIn && !loginSignup &&
          <div className='flex flex-col gap-2'>
            <div className='text-xl text-center'>Login</div>
            <div className='self-end'>
              <label>Email:</label>
              <input type="text" name="email" className='ml-2 rounded bg-gray-300' />
            </div>
            <div>
              <label>Password:</label>
              <input type="text" name="text" className='ml-2 rounded bg-gray-300' />
            </div>
            <div>
              <p className='text-[12px] text-center'>Don't have account? <span className='text-blue-400' onClick={() => setLoginSignup(true)}>SignUp</span></p>
            </div>
            <div className='flex justify-center'>
              <button className='px-2 py-1 rounded-2xl bg-blue-300' onClick={handleLogin}>Login</button>
            </div>
          </div>
        }

        {!isLoggedIn && loginSignup &&
          <div className='flex flex-col gap-2'>
            <div className='text-xl text-center'>SignUp</div>
            <div className='self-end'>
              <label>Email:</label>
              <input type="text" name="email" className='ml-2 rounded bg-gray-300' />
            </div>
            <div>
              <label>Password:</label>
              <input type="text" name="text" className='ml-2 rounded bg-gray-300' />
            </div>
            <div>
              <p className='text-[12px] text-center'>Already have an account? <span className='text-blue-400' onClick={() => setLoginSignup(false)}>Login</span></p>
            </div>
            <div className='flex justify-center'>
              <button className='px-2 py-1 rounded-2xl bg-blue-300' onClick={handleSignUp}>SignUp</button>
            </div>
          </div>
        }

        {isLoggedIn &&
          <div className='flex flex-col gap-2'>
            <div className='flex justify-center'>
              <button className='px-2 py-1 rounded-2xl bg-blue-200' onClick={getUserData}>{!userEmail? "Click to get User Email" : userEmail}</button>
            </div>
            <p className='text-center'>Login hogaya bhai tu</p>
            <p className='text-center'>Ab Logout karde</p>
            <div className='flex justify-center'>
              <button className='px-2 py-1 rounded-2xl bg-red-400' onClick={handleLogout}>Logout</button>
            </div>
          </div>
        }
      </div>

    </div>
  )
}

export default App
