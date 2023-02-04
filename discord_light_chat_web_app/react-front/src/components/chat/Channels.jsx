import React, { useContext } from 'react'
import { ChatContext } from '@/contexts/ChatContext'
import { AuthContext } from '@/contexts/AuthContext'

import { BsTrash } from 'react-icons/bs'

export default function Channels () {
  const {
    channels,
    activeChat,
    setActiveChat,
    joinChannelAction,
    deleteChannelAction
  } = useContext(ChatContext)
  const { user } = useContext(AuthContext)

  return (
    <div className='w-full my-3'>
    <div className='bg-black rounded-sm p-5 border border-white'>
      <p className='text-3xl font-lg text-white'>CHANNELS</p>{' '}
        {channels.length
          ? channels.map(item => (
              <div
                onClick={() => {
                  setActiveChat(item)
                }}
                key={item.id}
                className={`text-white flex w-full cursor-pointer items-center justify-between px-2 my-1 ${
                  item.id === activeChat?.id ? 'p-2 border border-white' : ''
                }`}
              >
                <p>{item.name}</p>
                <div className='flex items-center'>
                  {item?.participants?.some(
                    participant => participant.id === user.id
                  ) ? (
                    'JOINED'
                  ) : (
                    <div
                      onClick={() => {
                        joinChannelAction({
                          userId: user.id,
                          channelId: item.id,
                          channelName: item.name
                        })
                      }}
                      className='text-white px-3 rounded-sm border border-white'
                    >
                      JOIN
                    </div>
                  )}

                  {user.type === 'admin' && (
                    <BsTrash
                      onClick={() => {
                        deleteChannelAction(item.id)
                      }}
                      className='ml-2'
                      size={20}
                    />
                  )}
                </div>
              </div>
            ))
          : ''}
      </div>
    </div>
  )
}
