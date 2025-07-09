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

  // const { isMatchingLocation } = useIsMatchingLocation();
  console.log("..............isLoaded..............", isLoaded, isErrored, error);
  // TODO: Implement a better loading strategy
  if (
    !isLoaded
    // &&
    // !isMatchingLocation(AppPath.Verify) &&
    // !isMatchingLocation(AppPath.VerifyEmail)
  )
    return null;

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
