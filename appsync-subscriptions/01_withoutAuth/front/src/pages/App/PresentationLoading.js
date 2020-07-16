import React from 'react';

export default function AppPresentationLoading() {
   return <div>
       <button className='button mb-5 mr-2' disabled>Send Data</button>
       <button className='button mb-5' disabled>Backend Sets to complete</button>
       <h1 className='is-size-2'>Processing: no</h1>
       <div className='card px-5 py-5'>
           <p className='has-text-weight-bold'>Past Transactions</p>
           <p>Loading...</p>
       </div>
  </div>
}


