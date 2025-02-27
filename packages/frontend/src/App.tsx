import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import { ApolloProvider } from '@apollo/client'
import client from './components/AppolloClientConnection/apolloClient'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Dashboard from './components/pages/Dashboard'
import DashboardLayout from './components/DashboardLayout/DashboardLayout'
import Settings from './components/pages/Settings'
import Invoices from './components/pages/Invoices'
import Integrations from './components/pages/Integrations'
import Teams from './components/pages/Teams'
import WhatsappInstants from './components/pages/WhatsappInstants'


function App() {
  return (
    <ApolloProvider client={client}>
    <BrowserRouter>
    <Routes>
    <Route path="/register" element={<Register />} />
    <Route path='/login' element={<Login />} />
    {/* <Route path='/dashboard' element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    } /> */}
     <Route element={<ProtectedRoute />}>
      {/* Protected Dashboard Layout */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="teams" element={<Teams />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="whatsappinstants" element={<WhatsappInstants />} />
      </Route>
      </Route >
    </Routes>
    </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
