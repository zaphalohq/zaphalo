import './App.css'

// import { RecoilRoot } from 'recoil';
import { AppErrorBoundary } from '@src/modules/error/components/AppErrorBoundary';
import { AppErrorFallback } from '@src/modules/error/components/AppErrorFallback';
import { AppRouter } from '@src/modules/app/components/AppRouter';
import GetCurrentUserWrapper from './modules/customWrapper/GetCurrentUserWrapper';
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';


function App() {
  return (
    <RecoilRoot>
      <AppErrorBoundary
        resetOnLocationChange={false}
        FallbackComponent={AppErrorFallback}>
          <HelmetProvider>
            <AppRouter />
          </HelmetProvider>
      </AppErrorBoundary>
    </RecoilRoot>
  )
}

export default App
