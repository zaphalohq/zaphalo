import { useRecoilValue } from 'recoil';

import { systemConfigApiStatusState } from '@src/modules/system-config/states/systemConfigApiStatusState';
import { AppErrorFullScreen } from '@src/modules/error/components/AppErrorFullScreen';
// import { AppPath } from '@/types/AppPath';
// import { useIsMatchingLocation } from '~/hooks/useIsMatchingLocation';

export const SystemConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { isLoaded, isErrored, error } = useRecoilValue(
    systemConfigApiStatusState,
  );

  return isErrored && error instanceof Error ? (
    <AppErrorFullScreen
      error={error}
      resetErrorBoundary={() => {
        window.location.reload();
      }}
      title="Unable to Reach Back-end"
    />
  ) : (
    children
  );
};
