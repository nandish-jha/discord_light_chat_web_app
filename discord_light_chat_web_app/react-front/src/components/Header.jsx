import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'

export default function header () {
  const { isAuthenticated, user, handleLogout } = useContext(AuthContext)

  return (
      <div className='bg-black w-full py-5'>
      <div className='w-11/12 mx-auto flex justify-between'>
        <Link to='/'>
          <p className='text-5xl text-white'>NANDISH'S DISCORD</p>
        </Link>
        <div>
          {!isAuthenticated && (
            <p className='text-white my-3'>CMPT 353 PROJECT</p>
          )}
          {isAuthenticated && (
            <div className='flex items-center'>
              <p className='mr-4'>{user.username}</p>
              <button
                onClick={handleLogout}
                className='px-3 py-2 rounded-sm text-white font-bold focus:text-black focus:font-bold focus:bg-white mx-2 border border-white'
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
