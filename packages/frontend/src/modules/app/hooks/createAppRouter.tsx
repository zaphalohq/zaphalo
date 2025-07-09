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
import Template from '@src/pages/Template';
import Login from '@src/components/Auth/Login';
import Dashboard from '@src/pages/Dashboard';
import Workspace from '@src/pages/Workspace';
import MainLayout from '@src/pages/MainLayout';
import Broadcast from '@src/pages/Broadcast';
import MailingList from '@src/pages/MailingList';
import Register from '@src/components/Auth/Register';
import LoadingPage from '@src/components/UI/Loadingpage';
import WhatsappInstants from '@src/pages/WhatsappInstants';
import SignUpPage from '@src/modules/auth/pages/SignUpPage';
import { PageTitle } from '@src/modules/ui/components/PageTitle';
import client from '@src/components/AppolloClientConnection/apolloClient';
import ProtectedRoute from '@src/components/ProtectedRoute/ProtectedRoute';
import VerifyLoginTokenEffect from '@src/modules/auth/pages/VerifySignInPage';
import GetCurrentUserWrapper from '@src/modules/customWrapper/GetCurrentUserWrapper';
import SettingsWorkspace from '@src/pages/settings/SettingsWorkspace';
import { SystemConfigProviderEffect } from '@src/modules/system-config/components/SystemConfigProviderEffect';
import { SystemConfigProvider } from '@src/modules/system-config/components/SystemConfigProvider';

export const AppRouterProviders = () => {
  const pageTitle = "YaariAPI";
  return (
    <ApolloProvider client={client}>
      <SystemConfigProviderEffect/>
      <SystemConfigProvider>
        <GetCurrentUserWrapper />
        <PageTitle title={pageTitle} />
        <Outlet />
      </SystemConfigProvider>
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
    <Route path='/login2' element={<SignUpPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/w/:workspaceId" element={<MainLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="workspace" element={<Workspace />} />
        <Route path="chats" element={<Chats />} />
        <Route path="whatsappinstants" element={<WhatsappInstants />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="template" element={<Template />} />
        <Route path="mailinglist" element={<MailingList />} />
        <Route path="broadcast" element={<Broadcast />} />
        <Route path="loading" element={<LoadingPage />} />
        <Route path="settings" element={<SettingsWorkspace />} />
      </Route>
    </Route >
  </Route>
);

export const router = createBrowserRouter(routes);