import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import Chats from '@src/pages/Chats';
import Contacts from '@src/pages/Contacts';
import Login from '@src/components/Auth/Login';
import Dashboard from '@src/pages/Dashboard';
import MainLayout from '@src/pages/MainLayout';
import Broadcast from '@src/pages/Broadcast';
import MailingList from '@src/pages/MailingList';
import Register from '@src/components/Auth/Register';
import LoadingPage from '@src/components/UI/Loadingpage';
import WhatsAppAccount from '@src/pages/WhatsAppAccount';
import SignUpPage from '@src/modules/auth/pages/SignUpPage';
import { PageTitle } from '@src/modules/ui/components/PageTitle';
import client from '@src/components/AppolloClientConnection/apolloClient';
import ProtectedRoute from '@src/components/ProtectedRoute/ProtectedRoute';
import VerifyLoginTokenEffect from '@src/modules/auth/pages/VerifySignInPage';
import WorkspaceAdmin from '@src/pages/settings/SettingsWorkspace';
import { SystemConfigProviderEffect } from '@src/modules/system-config/components/SystemConfigProviderEffect';
import { SystemConfigProvider } from '@src/modules/system-config/components/SystemConfigProvider';
import AppOverlay from "@src/modules/loader/AppOverlay";
import GetCurrentUserWrapper from '@src/modules/loader/GetCurrentUserWrapper';

// Whatsapp
import WhatsappTemplate from '@src/pages/whatsapp/Template';


export const AppRouterProviders = () => {
  const pageTitle = "ZapHalo";
  return (
    <ApolloProvider client={client}>
      <SystemConfigProviderEffect/>
      <SystemConfigProvider>
        <GetCurrentUserWrapper />
        <PageTitle title={pageTitle} />
        <Outlet />
      </SystemConfigProvider>
      <AppOverlay/>
    </ApolloProvider>
  );
};


const routes = createRoutesFromElements(
  <Route element={<AppRouterProviders />} loader={async () => Promise.resolve(null)}>
    <Route index element={<Navigate to="/login" replace />} />
    <Route path="/register" element={<Register />} />
    <Route path="/register/:workspaceInviteToken" element={<Register />} />
    <Route path="/invite/:workspaceInviteToken" element={<SignUpPage />} />
    <Route path="/verify" element={<VerifyLoginTokenEffect />} />
    <Route index path='/login' element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/w/:workspaceId" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chats" element={<Chats />} />
        <Route path="whatsapp-account" element={<WhatsAppAccount />} />
        <Route path="contacts" element={<Contacts />} />    
        <Route path="template" element={<WhatsappTemplate />} />
        <Route path="mailinglist" element={<MailingList />} />
        <Route path="broadcast" element={<Broadcast />} />
        <Route path="loading" element={<LoadingPage />} />
        <Route path="settings" element={<WorkspaceAdmin />} />
      </Route>
    </Route >
  </Route>
);

export const router = createBrowserRouter(routes);