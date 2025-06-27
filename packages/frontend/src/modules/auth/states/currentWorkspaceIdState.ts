import { atom } from 'recoil';

export const currentWorkspaceIdState = atom<string | null>({
  key: 'currentWorkspaceIdState',
  default: null,
});