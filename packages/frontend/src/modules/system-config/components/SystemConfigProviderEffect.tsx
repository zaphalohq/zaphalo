import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { systemConfigApiStatusState } from '@src/modules/system-config/states/systemConfigApiStatusState';
import { authProvidersState } from '@src/modules/system-config/states/authProvidersState';
import { useGetSystemStatus } from '@src/generated/graphql';
import { isDefined } from '@src/utils/validation/isDefined';

export const SystemConfigProviderEffect = () => {

  const [ systemConfigApiStatus, setSystemConfigApiStatus ] = useRecoilState(
    systemConfigApiStatusState
  );

  const setAuthProviders = useSetRecoilState(authProvidersState);


  const { data, loading, error } = useGetSystemStatus({
    skip: systemConfigApiStatus.isLoaded,
  });

  useEffect(() => {
    if (loading){
      return;
    }

    if (error instanceof Error) {
      setSystemConfigApiStatus((currentStatus) => ({
        ...currentStatus,
        isErrored: true,
        error,
      }));
      return;
    }

    if (!isDefined(data?.systemConfig)) {
      return;
    }
    setSystemConfigApiStatus((currentStatus) => ({
      ...currentStatus,
      isLoaded: true
    }));

    setAuthProviders({
      google: data?.systemConfig.authProviders.google,
    });

  }, [data, loading, error]);

  return <></>;
}