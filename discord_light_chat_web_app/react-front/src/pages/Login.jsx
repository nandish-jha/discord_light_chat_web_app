import React, { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

function LoginPage () {
  const { handleLogin } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    await handleLogin({ email, password })
  }

  return (
    <div className='flex h-screen bg-black'>
      <div className='m-auto w-full max-w-md'>
        <form onSubmit={handleSubmit}>

            <div className='mb-6 gap-3'>
              <React.Fragment>
                <p style={{ color:'white'}}>My name is <u>Nandish Jha</u>. This is my finished product/project for CMPT 353, called "<i>NANDISH'S DISCORD</i>".</p>
                <span></span><br/>
                <p style={{ color:'white'}}>This page is the landing page. Below you can either LOGIN if you already have an account or else REGISTER for a new one.</p>
                <span></span><br/>
                <p style={{ color:'white'}}><b>NOTE</b>: The information about the admin account will be in a README.txt file.</p>
                <span></span><br/>
                <p style={{ color:'white'}}>THANK YOU</p>
              </React.Fragment>
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
              LOGIN
            </button>
            <React.Fragment>
              <Link to='/register' style={{ color:'white'}} className='px-6'>Don't have an account? REGISTER</Link>
            </React.Fragment>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
