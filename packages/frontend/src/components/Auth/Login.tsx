import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { LoginMutation } from './AuthMutations/LoginMutation';
import { useNavigate } from 'react-router-dom';
import AuthInputLabel from '../UI/AuthInputLabel';
import { setItem } from '../utils/localStorage';
import { cookieStorage } from '@src/utils/cookie-storage';


function Login() {

const [login, { data, loading, error }] = useMutation(LoginMutation);
const navigate = useNavigate();

useEffect(() => {
  const access_token = localStorage.getItem('access_token')
  if(access_token){
    navigate('/dashboard')
  }
}, [navigate])

const [authForm, setAuthForm] = useState({
  username : '',
  password : ''
})  
const HandleChange = (e : any) => {
  const { name, value } = e.target
  setAuthForm({
    ...authForm,
     [name] : value
  })
}

const handleSubmit = async (event : any) => {
  event.preventDefault();
  console.log();
  
  try {
    const response = await login({
      variables: {
        username : authForm.username,
        password : authForm.password,
      },
    });
    console.log('Login Success:', response.data);    
    // Save accessToken in localStorage or cookies
    setItem('access_token', response.data.login.access_token);  
    cookieStorage.setItem(
            'accessToken',
            JSON.stringify(
              response.data.login.access_token
            ),
          );
    const workspaceIds = JSON.parse(response.data.login.workspaceIds)
    setItem('workspaceIds', workspaceIds)
    sessionStorage.setItem('workspaceId', workspaceIds[0]);
    // setItem('userDetails',{ name : response.data.login.userDetails.name, email : response.data.login.userDetails.email })
    navigate('/dashboard')
  } catch (err) {
    console.error('Error logging in:', err);
  }
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500">Error: {error.message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
          <AuthInputLabel type='text' title="Username" name="username" placeholder="Enter your username" HandleChange={HandleChange} />
          </div>
          <div className="mb-6">
          <AuthInputLabel type='password' title="password" name="password" placeholder="Enter your password" HandleChange={HandleChange} />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-500 text-white p-3 rounded-lg hover:bg-violet-600"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
