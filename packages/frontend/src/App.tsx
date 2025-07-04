import './App.css'
import { HelmetProvider } from 'react-helmet-async';
import { RecoilRoot } from 'recoil';
import { AppRouter } from '@src/modules/app/components/AppRouter';
import { AppErrorBoundary } from '@src/modules/error/components/AppErrorBoundary';
import { AppErrorFallback } from '@src/modules/error/components/AppErrorFallback';


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
