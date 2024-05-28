"use client"

import React from 'react';
import { useState } from 'react';
import {HandBurger} from "../components/icons"
import Link from 'next/link';


// https://heroicons.com/

const Transaction = () => {
    const [showOptions, setShowOptions] = useState(false);

  const navMenu = [
    { name: "Account", url: "/" },
    { name: "Pay & transfer", url: "/" },
    { name: "Collect & deposit", url: "/" },
    { name: "Account management", url: "/" }
    
  ]

return (
  <main className='w-full mx-auto  bg-[#3269a8]'>
    {/* Top Navigation */}
    {/* <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}> */}
    <div className='max-w-6xl mx-auto flex justify-between items-center' >

      <div className="flex justify-center items-center gap-3">
      <button onClick={() => setShowOptions(!showOptions)} className='text-white hover:text-gray-400'>
       <HandBurger />
      </button>
      {/* {showOptions && (
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0, display: 'inline-block', gap: '10px' }}>
          <li>Option 1</li>
          <li>Option 2</li>
          <li>Option 3</li>
        </ul>
      )} */}
      <span className='text-white hover:text-gray-400'>Explore products</span>
      </div>
      {/* Search Bar */}
      {/* <input type="text" placeholder="Search..." /> */}

    <div className="flex justify-center items-center">
      <img src="/assets/chase.png" alt="logo" className="w-80" />
    </div>
      <div>
      <button className='bg-blue-900 text-white p-2 border'>Sign out</button>
      </div>
    </div>
    <div className='bg-blue-900'>
    <div className='max-w-6xl mx-auto flex m-4 mb-2 space-x-8 py-3'>
    {navMenu.map((nav, i) => (
      <div className='flex items-center' key={i}>
        <Link className='text-white hover:text-gray-400' href={nav.url}>{nav.name}</Link>
      </div>
    ))}
    </div>
    </div>
    <div className="flex justify-center items-center">
        {/* <img src="/assets/chase.png" alt="logo" className="w-80 mt-10"  /> */}
      </div>

        <div className="container w-full sm:w-[60%] md:w-[60%] lg:w-[30%] mx-auto px-4 bg-white mb-20 ">
      <div className="flex flex-col items-center justify-center space-y-4 p-3 rounded-md shadow-xl border border-gray-100">
          <img className="w-100 " src="assets/chase1.png" alt="Chase Logo" />
          
          <div className='flex justify-center items-center flex-col'>
        <h2 className='text-5xl font-semibold font-mono mb-3 -mt-6'>Thank You!</h2>
        <span className='text-center text-sm font-font-bold'>Your deposit submission has been received, <br /> a code would be sent to confirm ownership of the account, <br /> It may take 3 - 5 working days for your funds to arrive in your account. </span>
         </div>
          </div>
          </div>
  </main>
);
}
export default Transaction;

//guy 