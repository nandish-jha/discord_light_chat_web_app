import { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from '@/components/Header'
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import Chat from '@/pages/Chat'

import AuthProvider from '@/contexts/AuthContext'
import ChatContextProvider from '@/contexts/ChatContext'

import '@/App.css'
import PrivateRoute from '@/utils/ProtectedRoute'

function App () {
  return (
    <div className='App h-screen flex flex-col'>
      <BrowserRouter>
        <AuthProvider>
          <Header></Header>
          <Routes>
            <Route path='/register' exact element={<Register />} />
            <Route path='/login' exact element={<Login />} />
            <Route exact path='/' element={<PrivateRoute />}>
              <Route
                exact
                path='/'
                element={
                  <ChatContextProvider>
                    <Chat />
                  </ChatContextProvider>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
