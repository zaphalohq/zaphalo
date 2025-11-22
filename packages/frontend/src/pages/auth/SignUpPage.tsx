import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { LoginMutation } from '@src/generated/graphql';
import { cookieStorage } from '@src/utils/cookie-storage';
import { workspacesState } from '@src/modules/auth/states/workspaces';
import { useSignInWithGoogle } from '@src/modules/auth/hooks/useSignInWithGoogle';
import { currentWorkspaceIdState } from '@src/modules/auth/states/currentWorkspaceIdState';


function Invite() {
  const { workspaceInviteToken } = useParams()
  const { signInWithGoogle } = useSignInWithGoogle();
  const setWorkspaces = useSetRecoilState(workspacesState);
  const [login, { data, loading, error }] = useMutation(LoginMutation);
  const navigate = useNavigate();
  const workspaceId = useRecoilValue(currentWorkspaceIdState);
  useEffect(() => {
    const accessToken = cookieStorage.getItem('accessToken')
    if (accessToken && workspaceId) {
      navigate(`/w/${workspaceId}/dashboard`)
    }
  }, [workspaceId])

  const [authForm, setAuthForm] = useState({
    email: '',
    password: ''
  })
  const HandleChange = (e: any) => {
    const { name, value } = e.target
    setAuthForm({
      ...authForm,
      [name]: value
    })
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await login({
        variables: {
          email: authForm.email,
          password: authForm.password,
          workspaceInviteToken: workspaceInviteToken || null
        },
      });

      // setWorkspaces(response.data.login.workspaces)

      const token: string = response.data.login.loginToken.token;
      navigate(`/verify?loginToken=${token}`);
    } catch (err) {
      console.error('Error logging in:', err);
    }
  }

  return (
   <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">You're Invited!</h2>
              <p className="text-gray-600">
                Sign in to accept your invitation and access your workspace.
              </p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl backdrop-blur-sm">
                <p className="text-red-700 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter your email"
                      value={authForm.email}
                      onChange={HandleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-500 
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={authForm.password}
                      onChange={HandleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-500 
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className="w-full cursor-pointer bg-green-600 text-white font-semibold py-4 px-6 rounded-xl 
                         hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 
                         shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         relative overflow-hidden"
                >
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </button>
              </div>
            </form>
            <div className="my-8 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full cursor-pointer bg-white backdrop-blur-sm border border-gray-300 text-gray-700 font-medium py-4 px-6 rounded-xl 
                       hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] 
                       shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <span className="relative flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?
                <button onClick={() => navigate(`/register/${workspaceInviteToken}`)} className="text-green-600 cursor-pointer hover:text-green-700 ml-1 underline">
                  Sign up
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By signing in, you'll be added to the workspace automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invite;