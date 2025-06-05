import { useDebouncedCallback } from 'use-debounce';

export const useRedirect = () => {
  const redirect = useDebouncedCallback((url: string, target?: string) => {
    window.open(url, target ?? '_self');
  }, 1);

  return {
    redirect,
  };
};
