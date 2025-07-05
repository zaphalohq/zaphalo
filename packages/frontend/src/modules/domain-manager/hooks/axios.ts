import axios from 'axios';
import { cookieStorage } from '@src/utils/cookie-storage';

export const Post = async (url, formData, headers) => {

	const accessToken = cookieStorage.getItem('accessToken')
  let workspaceId = '';
  const path = window.location.pathname;
  const segments = path.split('/');
  if(segments.length > 2 && segments[1] === 'w'){
    workspaceId = segments[2];
  }

  const authtoken = accessToken ? JSON.parse(accessToken).accessToken : false;
  console.log("...............................", headers, `${process.env.VITE_BACKEND_URL}${url}`);
	return await axios.post(
		`${process.env.VITE_BACKEND_URL}${url}`,
		formData,
		{
			headers: {
				...headers,
				Authorization: authtoken ? `Bearer ${authtoken.token}` : '',
				'x-workspace-id': workspaceId || '',
			} 
		}
	);
};
