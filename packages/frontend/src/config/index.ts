declare global {
  interface Window {
    _env_?: Record<string, string>;
    __APOLLO_CLIENT__?: any;
  }
}

const getDefaultUrl = () => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return 'http://localhost:3000';
  } else {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''
      }`;
  }
};


export const VITE_BACKEND_URL =
  window._env_?.VITE_BACKEND_URL ||
  process.env.VITE_BACKEND_URL ||
  getDefaultUrl();
