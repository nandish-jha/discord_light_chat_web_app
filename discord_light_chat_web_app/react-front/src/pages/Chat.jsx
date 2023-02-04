import React, { useState, useRef, useEffect, useContext } from 'react'
import { FaReply } from 'react-icons/fa'

import { AuthContext } from '../contexts/AuthContext'
import { ChatContext } from '@/contexts/ChatContext'

import ChatUsers from '@/components/chat/ChatUsers'
import Channels from '@/components/chat/Channels'
import CreateChannel from '@/components/chat/CreateChannel'
import SingleMessage from '@/components/chat/SingleMessage'

const Chat = () => {
  const { chat, activeChat, sendMessage, channelActive } =
    useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const [replyTo, setReplyTo] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const messageListRef = useRef(null)

  const handleInputChange = event => {
    setInputValue(event.target.value)
  }

  const handleSendMessage = e => {
    e.preventDefault()
    if (inputValue.trim() !== '' && user && activeChat) {
      sendMessage({
        message: inputValue,
        from: user.id,
        to: activeChat.id,
        time: new Date(),
        ...(replyTo && { replyTo: replyTo.id }),
        channelName: activeChat.name
      })
      setInputValue('')
      setReplyTo(null)
    } else {
      alert('inputvalue, user and activechat is not available')
    }
  }

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight
  }, [chat])

  return (
    <div className='bg-black container mx-auto flex flex-col flex-1 px-5'>
      <div className='flex flex-1 gap-6'>
        <div className='w-1/11'>
          <ChatUsers />
          <Channels />
          <CreateChannel />
        </div>
        <div className='w-4/5 mx-auto flex flex-col flex-1'>
          {activeChat && (
            <p className='text-4xl p-4 rounded-sm text-white border border-white'>{`${
              activeChat?.username || activeChat?.name
            }`}</p>
          )}
          <div
            className='flex-1 flex flex-col overflow-y-auto bg-black rounded-sm p-4'
            ref={messageListRef}
          >
            {channelActive ? (
              <ul
                className='text-whitespace-y-4 flex-1 p-4 overflow-y-auto text-white bg-black'
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              >
                {chat?.length
                  ? chat.map((message, index) => (
                      <SingleMessage
                        index={index}
                        key={`Message${index}`}
                        message={message}
                        setReplyTo={setReplyTo}
                      />
                    ))
                  : ''}
              </ul>
            ) : (
              <div className='flex flex-grow flex-col justify-center items-center w-full text-white'>Are you lonely? Join a channel to start chatting</div>
            )}
          </div>
          {channelActive && (
            <form
              onSubmit={handleSendMessage}
              className='p-4 bg-black rounded-sm mb-4'
            >
              {replyTo && (
                <div className='flex items-center text-gray-500'>
                  <FaReply className='mr-1' />: {replyTo.message}
                </div>
              )}
              <div className='flex items-center space-x-5'>
                <input
                  type='text'
                  className='text-3xl w-full px-3 py-2 bg-gray-900 rounded-sm text-white border border-1 focus:bg-gray-600 focus:text-white'
                  placeholder='TYPE MESSAGE HERE'
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <button
              className='px-3 py-2 bg-gray-900 rounded-sm font-bold text-gray-400 border border-1 focus:bg-white focus:text-black focus:font-bold'
                  type='submit'
                >
                  SEND
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
