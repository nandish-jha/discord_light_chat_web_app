import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import {
  fetchChat,
  fetchUsers,
  fetchMessages,
  CreateChannel,
  fetchChannles,
  JoinChannel
} from '@/services/api.service'
import { AuthContext } from './AuthContext'
export const ChatContext = createContext()

// Wrap the component with the context provider
export default function ChatContextProvider ({ children }) {
  const { user } = useContext(AuthContext)
  const [socket, setSocket] = useState(null)
  const [chat, setChat] = useState([])
  const [users, setUsers] = useState([])
  const [chatUsers, setChatUsers] = useState([])
  const [channels, setChannels] = useState([])
  const [activeChat, setActiveChat] = useState('')
  const [channelActive, setChannelActive] = useState(false)
  const [channelJoined, setChannelJoined] = useState('')

  const loadChatFromDb = async to => {
    if (to) {
      const messages = await fetchMessages(to)
      setChat(messages)
    } else {
      const chatsFromDb = await fetchChat()
      setChat(chatsFromDb)
    }
  }
  const loadUsers = async () => {
    const users = await fetchUsers()
    setUsers(users)
  }
  const loadChannels = async () => {
    const channels = await fetchChannles()
    const filteredArray = channels.filter(elem => elem.id !== user.id)
    if (filteredArray) {
      setActiveChat(
        filteredArray[Math.floor(Math.random() * filteredArray.length)]
      )
    }
    setChannels(channels)
  }
  useEffect(() => {
    loadUsers()
    loadChannels()
  }, [])

  useEffect(() => {
    loadChatFromDb(activeChat?.id)
  }, [activeChat])

  useEffect(() => {
    if (activeChat) {
      setChannelActive(
        activeChat.participants?.some(participant => participant.id === user.id)
      )
    }
  }, [activeChat])

  useEffect(() => {
    if (socket) {
      socket.on('messagesUpdated', data => {
        setChat([...chat, data])
      })
      socket.on('updatedUsers', data => {
        setChatUsers([...users, ...data])
      })
      socket.on('welcome', data => {
        setChannels(data)
      })
      socket.on('getAllMessages', data => {
        setChat(data)
      })
      socket.on('channelJoinedInit', data => {
        setChannelJoined(data)
      })
      socket.on('updateAllUsers', data => {
        setUsers(data)
      })
      socket.on('error', data => {
        alert(data)
      })
    }
    // cleanup function to remove all event listeners
    return () => {
      if (socket) {
        socket.off('messagesUpdated')
        socket.off('updatedUsers')
        socket.off('welcome')
        socket.off('getAllMessages')
        socket.off('channelJoinedInit')
        socket.off('updateAllUsers')
        socket.off('error')
      }
    }
  }, [socket])

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL) // replace with your Socket.io server URL
      setSocket(newSocket)
    }
  }, [user])

  useEffect(() => {
    if (activeChat?.id && socket) {
      socket.emit('join', { channelName: activeChat?.name })
    }
  }, [socket, activeChat])

  const sendMessage = ({ channelName, ...message }) => {
    socket.emit('messageSend', {
      channelName: channelJoined,
      message
    })
  }

  const createChannelAction = async name => {
    const newChannel = await CreateChannel({ name, userId: user.id })
    if (newChannel?.id) {
      loadChannels()
    }
  }
  const joinChannelAction = async ({ userId, channelId, channelName }) => {
    socket.emit('joinchannel', {
      userId,
      channelId,
      channelName
    })
  }

  const submitReaction = async ({ reactionType, usrId, msgId }) => {
    socket.emit('addReaction', {
      channelName: channelJoined,
      channelId: activeChat.id,
      usrId,
      msgId,
      reactionType
    })
  }

  const deleteMessageAction = messageId => {
    socket.emit('deleteMessage', {
      messageId,
      channelName: channelJoined,
      channelId: activeChat.id
    })
  }
  const deleteChannelAction = channelId => {
    socket.emit('deleteChannel', {
      channelId
    })
  }
  const deleteUserAction = userId => {
    socket.emit('deleteUser', { userId })
  }

  return (
    <ChatContext.Provider
      value={{
        chat,
        users,
        chatUsers,
        activeChat,
        channels,
        channelActive,
        sendMessage,
        setActiveChat,
        createChannelAction,
        joinChannelAction,
        submitReaction,
        deleteMessageAction,
        deleteChannelAction,
        deleteUserAction
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
