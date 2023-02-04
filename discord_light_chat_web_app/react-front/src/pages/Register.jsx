import React, { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Register () {
  const { handleRegister } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    await handleRegister({ username, email, password })
  }
  return (
    <div className='flex h-screen bg-black'>
      <div className='m-auto w-full max-w-md'>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
              <input
                placeholder='USERNAME'
                type='text'
                id='username'
                name='username'
                value={username}
                onChange={e => setUsername(e.target.value)}
                className='text-3xl w-full px-3 py-2 bg-gray-900 rounded-sm text-white border border-1 focus:bg-gray-600 focus:text-white'
              />
            </div>
            <div className='mb-6'>
              <input
                placeholder='EMAIL'
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='text-3xl w-full px-3 py-2 bg-gray-900 rounded-sm text-white border border-1 focus:bg-gray-600 focus:text-white'
              />
            </div>
            <div className='mb-6'>
              <input
                placeholder='PASSWORD'
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='text-3xl w-full px-3 py-2 bg-gray-900 rounded-sm text-white border border-1 focus:bg-gray-600 focus:text-white'
              />
            </div>
            <div className='mb-6'>
              <button type='submit' className='px-3 py-2 bg-gray-900 rounded-sm font-bold text-gray-400 border border-1 focus:bg-white focus:text-black focus:font-bold'>
                REGISTER
              </button>
              <React.Fragment>
                <Link to='/login' style={{ color:'white'}} className='px-6'>Already have an account? LOGIN</Link>
              </React.Fragment>
            </div>
          </form>
        </div>
      </div>
  )
}
