import { cookieStorage } from '@src/utils/cookie-storage';
import { isDefined } from '@src/utils/validation/isDefined';
import { AuthTokenPair } from '@src/generated/graphql';

export const getTokenPair = () => {
  const stringTokenPair = cookieStorage.getItem('tokenPair');
  return isDefined(stringTokenPair)
    ? (JSON.parse(stringTokenPair) as AuthTokenPair)
    : undefined;
};
