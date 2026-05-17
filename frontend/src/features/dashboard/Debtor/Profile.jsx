import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Profile = () => {
  const { user, loading, error, isAuthenticated, role } = useSelector(state=> state.auth)

  return (
    <div>
      {Object.entries(user)?.map(([key, value, index]) =>(
        <div key={index} className='bg-gray-100 m-2 p-4 rounded-xl'>
          <p className='font-bold'>{key.toUpperCase()}</p>
          <p>{value}</p>
        </div>
      ))}
    </div>
  )
}

export default Profile
