import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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

import { AppRouter } from '@src/modules/app/components/AppRouter';



function App() {

  return (
    <RecoilRoot>
      <AppErrorBoundary
        resetOnLocationChange={false}
        FallbackComponent={AppErrorFallback}>
        <ApolloProvider client={client}>
          <AppRouter/>
        </ApolloProvider>
      </AppErrorBoundary>
    </RecoilRoot>
  )
}

export default App
