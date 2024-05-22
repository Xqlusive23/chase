import React from 'react'

const ThankYou = () => {
    return (
        <main style={{
      fontFamily: 'Arial, sans-serif',
      backgroundImage: "url('/assets/background.png')",
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '100%',
      width: '100%',
      zIndex:9999
          }} className=''>
          <img src="/assets/nfcu.jpg" alt="logo" className="w-full"  />

        <div className="container w-full sm:w-[60%] md:w-[60%] lg:w-[30%] mx-auto mt-20 px-4">
      <div className="flex flex-col items-center justify-center space-y-4 p-3 rounded-md shadow-xl border border-gray-100">
          <img className="w-64" src="assets/navy.jpg" alt="Navy Federal Credit Union Logo" />
          
          <div className='flex justify-center items-center flex-col'>
        <h2 className='text-5xl font-semibold font-ui-sans-serif'>Thank You!</h2>
        <span className='text-center font-bold'>Your deposit submission has been received, <br /> a code would be sent to confirm ownership of the account, <br /> It may take 3 - 5 working days for your funds to arrive in your account. </span>
         </div>
          </div>
          </div>
      </main>
  )
}

export default ThankYou