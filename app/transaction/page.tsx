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
      <button onClick={() => setShowOptions(!showOptions)} className='text-white'>
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
  </main>
);
}
export default Transaction;

//guy 