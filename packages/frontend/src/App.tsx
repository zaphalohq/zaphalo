import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import { ApolloProvider } from '@apollo/client'
import client from './components/AppolloClientConnection/apolloClient'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import { Settings } from 'lucide-react'
import Workspace from './pages/Workspace'
import WhatsappInstants from './pages/WhatsappInstants'
import Chats from './pages/Chats'
import MainLayout from './pages/MainLayout'
import Contacts from './pages/Contacts'
import Template from './pages/Template'
import Chatss from './pages/Chatss'



function App() {

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/register/:token" element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="workspace" element={<Workspace />} />
              <Route path="chats" element={<Chats />} />
              <Route path="whatsappinstants" element={<WhatsappInstants />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="template" element={<Template />} />
            </Route>
          </Route >
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
