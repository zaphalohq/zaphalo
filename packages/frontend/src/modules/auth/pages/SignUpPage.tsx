// import { useSignInWithGoogle } from '@src/modules/auth/hooks/useSignInWithGoogle';

// export default function SignUpPage() {

//   const { signInWithGoogle } = useSignInWithGoogle();

//   return (
//     <button
//       type="button"
//       className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
//       onClick={signInWithGoogle}>
//       <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
//       <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
//       </svg>
//       Sign in with Google
//     </button>
//   );
// }

import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cookieStorage } from '@src/utils/cookie-storage';
import { useSignInWithGoogle } from '@src/modules/auth/hooks/useSignInWithGoogle';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { tokenPairState } from '@src/modules/auth/states/tokenPairState';
import { useAuth } from '@src/modules/auth/hooks/useAuth';
import { workspacesState } from '@src/modules/auth/states/workspaces';
import { useVerifyLoginToken } from '@src/modules/auth/hooks/useVerifyLoginToken';
import { useAtomValue } from 'jotai';
import { currentWorkspaceIdState } from '@src/modules/auth/states/currentWorkspaceIdState';
import { setItem } from '@src/components/utils/localStorage';
import { LoginMutation } from '@src/generated/graphql';

function Invite() {
    const { workspaceInviteToken } = useParams()
  const [TokenPair, setTokenPair] = useRecoilState(tokenPairState);
  const { signInWithGoogle } = useSignInWithGoogle();
  const setWorkspaces = useSetRecoilState(workspacesState);
  const [login, { data, loading, error }] = useMutation(LoginMutation);
  const navigate = useNavigate();
  const { verifyLoginToken } = useVerifyLoginToken();
  const workspaceId = useRecoilValue(currentWorkspaceIdState);



  useEffect(() => {
    // const accessToken = Cookies.get('accessToken');
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
    console.log();

    try {
      const response = await login({
        variables: {
          email: authForm.email,
          password: authForm.password,
          inviteToken: workspaceInviteToken || null
        },
      });
      console.log('Login Success:', response.data);
      setItem('access_token', response.data.login.accessToken);
      cookieStorage.setItem(
        'accessToken',
        JSON.stringify(
          response.data.login.accessToken
        ),
      );
      const workspaceIds = JSON.parse(response.data.login.workspaceIds)
      setItem('workspaceIds', workspaceIds)

      setWorkspaces(response.data.login.workspaces)

      const token: string = response.data.login.accessToken.token;
      navigate(`/verify/${token}`);

      // await verifyLoginToken(token)

      // setTokenPair({
      //     accessToken: {
      //       token,
      //       expiresAt
      //     }
      //   });
      // cookieStorage.setItem(
      //   'accessToken',
      //   JSON.stringify(
      //     token
      //   ),
      // );
    } catch (err) {
      console.error('Error logging in:', err);
    }
  }




  return (
    <div className="min-h-screen bg-blacky-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">You're Invited!</h2>
              <p className="text-gray-300">
                Sign in to accept your invitation and access your workspace.
              </p>
            </div>
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-200 text-sm flex items-center">
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="Enter your email"
                      value={authForm.email}
                      onChange={HandleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={authForm.password}
                      onChange={HandleChange}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className="w-full cursor-pointer bg-violet-500 text-white font-semibold py-4 px-6 rounded-xl 
                         hover:bg-violet-600 transform hover:scale-[1.02] transition-all duration-200 
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
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="px-4 text-gray-300 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium py-4 px-6 rounded-xl 
                       hover:bg-white/20 transition-all duration-200 transform hover:scale-[1.02] 
                       shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <span className="relative flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 18 19" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" fill="currentColor" />
                </svg>
                Continue with Google
              </span>
            </button>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?
                <button onClick={() => navigate(`/register/${workspaceInviteToken}`)} className="text-violet-300 cursor-pointer hover:text-violet-200 ml-1 underline">
                  Sign up
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                By signing in, you’ll be added to the workspace automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Invite;