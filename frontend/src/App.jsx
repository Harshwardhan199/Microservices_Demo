import { useState, useEffect } from 'react';
import axios from 'axios';

function App2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginSignup, setLoginSignup] = useState(true);

  const [username, setUsername] = useState("Harsh");
  const [email, setEmail] = useState("harsh@gmail.com");
  const [password, setPassword] = useState("qwer");

  const [accessToken, setaccessToken] = useState("");

  const [userEmail, setUserEmail] = useState();
  const [secret, setSecret] = useState();

  const [secretChange, setSecretChange] = useState(false);
  const [newSecret, setNewSecret] = useState(446644);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.post("http://localhost:8080/refresh", {}, { withCredentials: true });
        setaccessToken(res.data.accessToken);
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
      }
    };

    if (isLoggedIn) {
      console.log("Getting");

      checkUser();
      getUserData();
    }

  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/login", { email, password }, { withCredentials: true });
      setaccessToken(res.data.accessToken);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post("http://localhost:8080/register", { username, email, password });
      console.log(res);

      setLoginSignup(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error: ", error);
    }

  };

  const getUserData = async () => {
    try {
      const res = await axios.post("http://localhost:8080/getData", {}, { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } });
      console.log(res.data);

      setUserEmail(res.data.username);
      setSecret(res.data.secret);
    } catch (error) {
      console.log(error);
    }
  };

  const changeSecret = async () => {
    try {
      console.log("Btn clicked");
      const res = await axios.post("http://localhost:8080/changeSecret", { newSecret }, { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } });
      console.log("Secret Changed");

      console.log(res.status);
      console.log("Logged");
      setSecret(newSecret);
      setSecretChange(false);
      console.log("sab set");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen w-screen '>

      <div className='p-3 rounded-xl bg-gray-100'>

        {!isLoggedIn && loginSignup &&
          <div className='flex flex-col gap-2'>

            <div className='text-xl text-center font-bold'>SignUp</div>

            <div className='flex flex-col'>
              <label>Username</label>
              <input type="text" name="username" className='rounded bg-gray-300' />
            </div>

            <div className='flex flex-col'>
              <label>Email</label>
              <input type="text" name="email" className='rounded bg-gray-300' />
            </div>

            <div className='flex flex-col'>
              <label>Password</label>
              <input type="text" name="text" className='rounded bg-gray-300' />
            </div>

            <div>
              <p className='text-[12px] text-center'>Already have an account? <span className='text-blue-400' onClick={() => setLoginSignup(false)}>Login</span></p>
            </div>

            <div className='flex justify-center'>
              <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={handleSignUp}>SignUp</button>
            </div>

          </div>
        }

        {!isLoggedIn && !loginSignup &&
          <div className='flex flex-col gap-2'>

            <div className='text-xl text-center font-bold'>Login</div>

            <div className='flex flex-col'>
              <label>Email</label>
              <input type="text" name="email" className='rounded bg-gray-300' />
            </div>

            <div className='flex flex-col'>
              <label>Password</label>
              <input type="text" name="text" className='rounded bg-gray-300' />
            </div>

            <div>
              <p className='text-[12px] text-center'>Don't have account? <span className='text-blue-400' onClick={() => setLoginSignup(true)}>SignUp</span></p>
            </div>

            <div className='flex justify-center'>
              <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={handleLogin}>Login</button>
            </div>

          </div>
        }

        {isLoggedIn &&
          <div className='min-w-60 flex flex-col gap-2'>

            <div className='flex justify-center'>
              <button className='px-2 py-1 border-b-2 border-b-purple-600' onClick={getUserData}>{!userEmail ? "Click to get Username" : userEmail}</button>
            </div>

            <div className='flex flex-col items-center justify-center gap-2 p-6'>

              {!secretChange &&
                <div>
                  <div>
                    <div className='text-center'>Secret Number:</div>
                    <div className='text-center'>{!secret ? "00000" : secret}</div>
                  </div>
                  <div>
                    <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={() => setSecretChange(true)}>Change Secret</button>
                  </div>
                </div>
              }

              {secretChange &&
                <div className='flex flex-col gap-2'>
                  <div className='text-center'>Enter a 6 dight Secret:</div>
                  <div className='flex gap-2'>
                    <input type="number" className='w-full rounded bg-gray-300 indent-1' />
                    <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={changeSecret}>Set Secret</button>
                  </div>
                </div>
              }

            </div>

            <div className='flex justify-center'>
              <button className='w-full px-2 py-1 rounded-lg bg-red-500 text-white' onClick={handleLogout}>Logout</button>
            </div>

          </div>
        }

      </div>

    </div>
  )
}

export default App2
