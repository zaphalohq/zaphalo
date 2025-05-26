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
import { RecoilRoot } from 'recoil';
import { ErrorBoundary } from "react-error-boundary";
import { AppErrorBoundary } from '@src/modules/error/components/AppErrorBoundary';
import { AppErrorFallback } from '@src/modules/error/components/AppErrorFallback';
import MailingList from './pages/MailingList'
import Broadcast from './pages/Broadcast'


function App() {

  return (
    <RecoilRoot>
      <AppErrorBoundary
        resetOnLocationChange={false}
        FallbackComponent={AppErrorFallback}>
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
                  <Route path="mailinglist" element={<MailingList />} />
                  <Route path="broadcast" element={<Broadcast />} />
                </Route>
              </Route >
            </Routes>
          </BrowserRouter>
        </ApolloProvider>
      </AppErrorBoundary>
    </RecoilRoot>
  )
}

export default App
