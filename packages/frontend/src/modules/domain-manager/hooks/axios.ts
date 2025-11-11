import axios from 'axios';
import { cookieStorage } from '@src/utils/cookie-storage';
import { VITE_BACKEND_URL } from '@src/config';

export const Post = async (url, formData, headers) => {

	const tokens = cookieStorage.getItem('tokenPair')
  let workspaceId = '';
  const path = window.location.pathname;
  const segments = path.split('/');
  if(segments.length > 2 && segments[1] === 'w'){
    workspaceId = segments[2];
  }

  const authtoken = tokens ? JSON.parse(tokens).accessToken : false;
	return await axios.post(
		`${VITE_BACKEND_URL}${url}`,
		formData,
		{
			headers: {
				...headers,
				Authorization: authtoken ? `Bearer ${authtoken.token}` : '',
				// 'x-workspace-id': workspaceId || '',
			} 
		}
	);
};


export const Delete = async (url) => {

	const accessToken = cookieStorage.getItem('accessToken')
  let workspaceId = '';
  const path = window.location.pathname;
  const segments = path.split('/');
  if(segments.length > 2 && segments[1] === 'w'){
    workspaceId = segments[2];
  }

  const authtoken = accessToken ? JSON.parse(accessToken).accessToken : false;
	return await axios.delete(
		`${import.meta.env.VITE_BACKEND_URL}${url}`,
		{
			headers: {
				Authorization: authtoken ? `Bearer ${authtoken.token}` : '',
				'x-workspace-id': workspaceId || '',
			} 
		}
	);
};