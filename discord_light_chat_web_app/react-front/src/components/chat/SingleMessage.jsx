import React, { useContext, useEffect, useMemo } from 'react'

import { FaReply } from 'react-icons/fa'
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLike,
  AiOutlineDislike
} from 'react-icons/ai'
import { BsTrash } from 'react-icons/bs'

import { AuthContext } from '@/contexts/AuthContext'
import { ChatContext } from '@/contexts/ChatContext'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function SingleMessage ({ message, setReplyTo, index }) {
  const { user } = useContext(AuthContext)
  const { submitReaction, deleteMessageAction } = useContext(ChatContext)
  const messageReaction = useMemo(
    () => message?.Reactions?.find(reaction => reaction.usrId === user.id),
    [message]
  )
  const reactionCounts = useMemo(() => {
    const counts = { like: 0, dislike: 0 }
    message?.Reactions?.forEach(reaction => {
      counts[reaction.reactionType] += 1
    })
    return counts
  }, [message?.Reactions])

  const AddReaction = reactionType => {
    submitReaction({ reactionType, msgId: message.id, usrId: user.id })
  }
  return (
    <li
      className={`${
        index % 2 === 0 ? 'bg-black' : 'bg-black'
      } p-4 rounded-sm relative group flex items-center justify-between w-2/5 border border-white m-8 ${
        message?.from === user?.id ? 'ml-auto' : ''
      }`}
    >
      <div className='w-full'>
        <span>{message?.sender?.username}</span>
        <p className='text-gray-500'>
          {message?.respondingMessage ? (
            <span className='flex items-center'>
              {' '}
              <FaReply className='mr-1' />:{message?.respondingMessage?.message}
            </span>
          ) : (
            ''
          )}
        </p>
        {message?.message}
        <p>{dayjs(message.createdAt).fromNow()}</p>
      </div>
      <div className='flex flex-col'>
        <div className='flex mb-2 justify-end'>
          {messageReaction?.reactionType !== 'like' && (
            <AiOutlineLike
              onClick={() => {
                AddReaction('like')
              }}
              size='25'
              className='cursor-pointer text-gray-500'
            />
          )}
          {messageReaction?.reactionType === 'like' && (
            <AiFillLike
              size='25'
              onClick={() => {
                AddReaction('like')
              }}
              className='cursor-pointer text-gray-500'
            />
          )}
          {reactionCounts.like}
          {messageReaction?.reactionType !== 'dislike' && (
            <AiOutlineDislike
              onClick={() => {
                AddReaction('dislike')
              }}
              size='25'
              className='cursor-pointer text-gray-500'
            />
          )}

          {messageReaction?.reactionType === 'dislike' && (
            <AiFillDislike
              size='25'
              onClick={() => {
                AddReaction('dislike')
              }}
              className='cursor-pointer text-gray-500'
            />
          )}

          {reactionCounts.dislike}
          {user.type === 'admin' && (
            <BsTrash
              onClick={() => {
                deleteMessageAction(message.id)
              }}
              className='ml-2 cursor-pointer text-gray-500'
              size={20}
            />
          )}
        </div>
        <div className='top-0 right-0'>
          <button
            onClick={() => {
              setReplyTo(message)
            }}
            className='text-gray-500 px-3 py-1 rounded-sm flex items-center justify-between'
          >
            <FaReply className='mr-1' />
            REPLY
          </button>
        </div>
      </div>
    </li>
  )
}
