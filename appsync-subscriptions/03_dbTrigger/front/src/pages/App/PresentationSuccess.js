import React from 'react';

export default function AppPresentationSuccess(props) {
  return <div>
    <button className='button mb-5 mr-2' onClick={props.create}>Build new profile</button>
    <h1 className='is-size-4'>Status: {props.sendingStatus ? 'sending...' : ''}</h1>
    <div className='card px-5 py-5'>
      <p className='has-text-weight-bold'>Profile</p>
      <p>
        Status: {props.profile.status}
      </p>
      <p>
        Favourite Color: {props.profile.favouriteColor}
      </p>
      <p>
        Favourite City: {props.profile.favouriteCity}
      </p>
      <p>
        Last Updated: {props.profile.lastUpdated}
      </p>
    </div>
  </div>
}
