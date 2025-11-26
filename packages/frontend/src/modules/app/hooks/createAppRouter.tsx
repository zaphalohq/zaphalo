import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet
} from 'react-router-dom';
import Chats from '@src/pages/Chats';
import Contacts from '@src/pages/Contacts';
import Login from '@src/pages/auth/Login';
import Dashboard from '@src/pages/Dashboard';
import MainLayout from '@src/pages/MainLayout';
import Broadcast from '@src/pages/Broadcast';
import MailingList from '@src/pages/MailingList';
import Register from '@src/components/Auth/Register';
import LoadingPage from '@src/components/UI/Loadingpage';
import WhatsAppAccount from '@src/pages/WhatsAppAccount';
import SignUpPage from '@src/pages/auth/SignUpPage';
import { PageTitle } from '@src/modules/ui/components/PageTitle';
import ProtectedRoute from '@src/modules/auth/hooks/ProtectedRoute';
import VerifyLoginTokenEffect from '@src/pages/auth/VerifySignInPage';
import WorkspaceAdmin from '@src/pages/settings/SettingsWorkspace';
import { SystemConfigProviderEffect } from '@src/modules/system-config/components/SystemConfigProviderEffect';
import { SystemConfigProvider } from '@src/modules/system-config/components/SystemConfigProvider';
import AppOverlay from "@src/modules/loader/AppOverlay";
import GetCurrentUserWrapper from '@src/modules/loader/GetCurrentUserWrapper';
import { ApolloProvider } from '@src/modules/apollo/components/ApolloProvider';
import { ApolloCoreProvider } from '@src/modules/apollo/components/ApolloCoreProvider';
import { SocketProvider } from '@src/modules/socket/components/SocketProvider';

// Whatsapp
import WhatsappTemplate from '@src/pages/whatsapp/Template';


export const AppRouterProviders = () => {
  const pageTitle = "ZapHalo";
  return (
    <ApolloProvider>
      <SystemConfigProviderEffect/>
      <SystemConfigProvider>
        <ApolloCoreProvider>
          <SocketProvider>
            <GetCurrentUserWrapper />
            <PageTitle title={pageTitle} />
            <Outlet />
          </SocketProvider>
        </ApolloCoreProvider>
      </SystemConfigProvider>
      {/*<AppOverlay/>*/}
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