import { useEffect } from 'react';
import { useRecoilState, useSetRecoliState } from 'recoil';

import { systemConfigApiStatusState } from '@src/modules/system-config/states/systemConfigApiStatusState';
import { useGetSystemStatus } from '@src/generated/graphql.tsx';


export const SystemConfigProviderEffect = () => {


  const [ systemConfigApiStatus, setSystemConfigApiStatus ] = useRecoilState(
    systemConfigApiStatusState
  );
    const { data, loading, error } = useGetSystemStatus({
      skip: systemConfigApiStatus.isLoaded,
    });

    useEffect(() => {
      if (loading){
        return;
      }
      setSystemConfigApiStatus((currentStatus) => ({
        ...currentStatus,
        isLoaded: true,
      }));
      if (error instanceof Error) {
        setSystemConfigApiStatus((currentStatus) => ({
          ...currentStatus,
          isErrored: true,
          error,
        }));
        return;
      }
    }, [data, loading, error]);

    return <></>;
}