import React, { useContext, useEffect, useMemo } from 'react'
import { ChatContext } from '@/contexts/ChatContext'
import { AuthContext } from '@/contexts/AuthContext'

import { BsTrash } from 'react-icons/bs'

export default function ChatUsers () {
  const { users, chatUsers, deleteUserAction } = useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const activeUsers = useMemo(() => {
    return users.map(user => {
      const isActive = chatUsers.some(chatUser => chatUser.id === user.id)
      return { ...user, status: isActive ? 'active' : 'inactive' }
    })
  }, [users, chatUsers])

  return (
    <div className='w-full my-3'>
      <div className='bg-black rounded-sm p-5 border border-white'>
        <p className='text-3xl font-lg text-white'>USERS</p>
        {activeUsers.length
          ? activeUsers.map(item =>
              item.id !== user.id ? (
                <div
                  key={item.id}
                  className={`text-white flex w-full cursor-pointer items-center justify-between`}
                >
                  <p>{item.username}</p>
                  {user.type === 'admin' && (
                    <BsTrash
                      onClick={() => {
                        deleteUserAction(item.id)
                      }}
                      className='ml-2'
                      size={20}
                    />
                  )}
                </div>
              ) : (
                ''
              )
            )
          : ''}
      </div>
    </div>
  )
}
