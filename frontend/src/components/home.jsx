import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";

function Home() {
    const navigate = useNavigate();

    const [accessToken, setaccessToken] = useState("");

    const [userEmail, setUserEmail] = useState();
    const [secret, setSecret] = useState();

    const [secretChange, setSecretChange] = useState(false);
    const [newSecret, setNewSecret] = useState(446644);

    useEffect(() => {
        const checkUser = async () => {
            try {
                console.log("Now Sending Request");
                
                const res = await axios.post("http://localhost:8080/auth/refresh", {}, { withCredentials: true });

                // To remove error logging in browser on failior
                if (res.status == 200){
                    return navigate("/login");
                }
                console.log("AccessToken: ", res.data.accessToken);
                
                setaccessToken(res.data.accessToken);
            } catch (error) {
                //navigate("/login");
                console.log(error);
            }
        };

        checkUser();
    }, []);

    // useEffect(() => {
    //     if (accessToken) {
    //         getUserData();
    //     }
    // }, [accessToken]);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            navigate("/login");
        } catch (error) {
            console.log("Error: ", error);
        }

    };

    const getUserData = async () => {  
        try {
            const res = await axiosInstance.get("http://localhost:8080/user/getData", { headers: { Authorization: `Bearer ${accessToken}` } });

            setUserEmail(res.data.username);
            setSecret(res.data.secret);
        } catch (error) {
            console.log(error);
        }
    };

    const changeSecret = async () => {
        // try {
        //     await axiosInstance.post("http://localhost:8080/user/changeSecret", { newSecret }, { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } });
        //     setSecret(newSecret);
        //     setSecretChange(false);

        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <div className='flex justify-center items-center h-screen w-screen '>

            <div className='p-3 rounded-xl bg-gray-100'>

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
                                    <input type="number" className='w-full rounded bg-gray-300 indent-1' value={newSecret} onChange={(e) => setNewSecret(e.target.value)}/>
                                    <button className='w-full px-2 py-1 rounded-lg bg-blue-500 text-white' onClick={changeSecret}>Set Secret</button>
                                </div>
                            </div>
                        }

                    </div>

                    <div className='flex justify-center'>
                        <button className='w-full px-2 py-1 rounded-lg bg-red-500 text-white' onClick={handleLogout}>Logout</button>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Home;
