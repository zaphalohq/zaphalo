import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RegisterMutation } from './AuthMutations/RegisterMutation';

const Register = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message : ''
  });
  const navigate = useNavigate()
  const { workspaceInviteToken } = useParams();
  const [register, { data, loading: registerLoading, error: registerError }] = useMutation(RegisterMutation);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError({ message: 'Passwords do not match' });
      return;
    }

    try {
      const response = await register({
        variables: {
          firstName,
          lastName,
          email,
          password,

          workspaceInviteToken: workspaceInviteToken,
        },
      });
      console.log('Registration successful', response.data.Register);
      // localStorage.setItem('authToken', response.data.Register.access_token);
      navigate('/login'); 
    } catch (err) {
      console.error('Error registering', err);
    }

    setLoading(true);
    setError({
      message: ''
    });

  };

    return (
    <div className="min-h-screen bg-blacky-900  flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-lg">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z" clip-rule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-300">Join us and start your journey</p>
            </div>
            {error?.message !== '' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-200 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {/* {error.message} */}
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                           backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent 
                             backdrop-blur-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 text-violet-600 bg-white/10 border-white/20 rounded focus:ring-violet-500 focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{' '}
                    <button type='button' className="text-violet-300 cursor-pointer hover:text-violet-200 underline">
                      Terms of Service
                    </button>
                  </label>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className="w-full cursor-pointer bg-violet-500 text-white font-semibold py-4 px-6 rounded-xl 
                         hover:bg-violet-600 transform hover:scale-[1.02] transition-all duration-200 
                         shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Create Account
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-violet-300 cursor-pointer hover:text-violet-200 underline">
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Register;