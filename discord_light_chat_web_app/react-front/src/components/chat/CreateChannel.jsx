import React, { useContext, useState } from 'react'
import { ChatContext } from '@/contexts/ChatContext'

export default function CreateChannel () {
  const { createChannelAction } = useContext(ChatContext)

  const [channelName, setChannelName] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    createChannelAction(channelName)
    setChannelName('')
  }
  return (
    <div className='w-full my-3'>
      <div className='bg-black p-6 border border-white rounded-sm'>
        <form onSubmit={handleSubmit}>
          <div className='mb-1'>
            <input
              placeholder='CHANNEL NAME'
              type='text'
              value={channelName}
              onChange={e => {
                setChannelName(e.target.value)
              }}
              className='text-3xl w-full px-3 py-2 bg-gray-900 rounded-sm text-white border border-1 focus:bg-gray-600 focus:text-white mb-6'
            />
          </div>
          <div className=''>
            <button
              type='submit'
              className='px-3 py-2 bg-gray-900 rounded-sm font-bold text-gray-400 border border-1 focus:bg-white focus:text-black focus:font-bold'
            >
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
