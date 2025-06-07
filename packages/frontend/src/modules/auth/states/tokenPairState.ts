import { AuthTokenPair } from 'src/generated/graphql';
import { cookieStorageEffect } from 'src/utils/recoil-effects';
import { createState } from 'src/utils/createState';

export const tokenPairState = createState<AuthTokenPair | null>({
  key: 'tokenPairState',
  defaultValue: null,
  effects: [
    cookieStorageEffect(
      'accessToken',
      {},
      {
        validateInitFn: (payload: AuthTokenPair) =>
          Boolean(payload['accessToken']),
      },
    ),
  ],
});
