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
import Integrations from './pages/Integrations'
import WhatsappInstants from './pages/WhatsappInstants'
import Chats from './pages/Chats'
import MainLayout from './pages/MainLayout'



function App() {
   
  return (
    <ApolloProvider client={client}>
    <BrowserRouter>
    <Routes>
    <Route path="/register/:token?" element={<Register />} />
    <Route path='/login' element={<Login />} />
    {/* <Route path='/dashboard' element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    } /> */}
     <Route element={<ProtectedRoute />}>
      {/* Protected Dashboard Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="workspace" element={<Workspace />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="chats" element={<Chats />} /> 
        <Route path="whatsappinstants" element={<WhatsappInstants />} />
      </Route>
      </Route >
      {/*<Route path="chats" element={<Chats />} /> */}
    </Routes>
    </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
