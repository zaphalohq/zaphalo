import { createState } from '@src/utils/createState';

type SystemConfigApiStatus = {
  isLoaded: boolean;
  isErrored: boolean;
  error?: Error;
};

export const systemConfigApiStatusState = createState<SystemConfigApiStatus>({
  key: 'clientConfigApiStatus',
  defaultValue: { isLoaded: false, isErrored: false, error: undefined },
});
