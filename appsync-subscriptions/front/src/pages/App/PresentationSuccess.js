import React from 'react';

export default function AppPresentationSuccess(props) {
  return <div>
      <button className='button mb-5 mr-2' onClick={props.create}>Send Data</button>
      <button className='button mb-5' onClick={props.complete}>Backend Sets to complete</button>
      <h1 className='is-size-2'>Processing: {props.processing}</h1>
      <div className='card px-5 py-5'>
        <p className='has-text-weight-bold'>Past Transactions</p>
        {props.items.map(({ PK, SK, status }) => (
            <div key={PK + SK}>
            <p>
               Payment Task: {status}
            </p>
            </div>
        ))}
      </div>
  </div>
}
