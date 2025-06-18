import './App.css'
import { ApolloProvider } from '@apollo/client'
import client from './components/AppolloClientConnection/apolloClient'
import { RecoilRoot } from 'recoil';
import { AppErrorBoundary } from '@src/modules/error/components/AppErrorBoundary';
import { AppErrorFallback } from '@src/modules/error/components/AppErrorFallback';
import { AppRouter } from '@src/modules/app/components/AppRouter';
import GetCurrentUserWrapper from './modules/customWrapper/GetCurrentUserWrapper';




function App() {

  return (
    <RecoilRoot>
      <AppErrorBoundary
        resetOnLocationChange={false}
        FallbackComponent={AppErrorFallback}>
        <ApolloProvider client={client}>
          <GetCurrentUserWrapper>
            <AppRouter />
          </GetCurrentUserWrapper>
        </ApolloProvider>
      </AppErrorBoundary>
    </RecoilRoot>
  )
}

export default App
