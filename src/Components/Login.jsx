import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { InlineLoading } from './Loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      const { data, error } = await signin(email, password);
      
      if (error) {
        setError(`Sign in failed: ${error.message}`);
      } else if (data?.user) {
        navigate('/dashboard');
      } else {
        setError('Sign in failed: No user data received');
      }
    } catch (err) {
      setError(`Failed to sign in: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch {
      setError('Failed to sign in with Google');
    }
  };
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      {/* Left Section: Sign In */}
      <div className="flex flex-col justify-center items-center sm:w-1/2 p-8 h-screen bg-white shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Sign In</h1>
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-10 h-10 cursor-pointer rounded-full hover:shadow-md transition-shadow"
            aria-label="Sign in with Google"
          >
            <svg viewBox="0 0 48 48" className="w-10 h-10">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </button>
        </div>
        <p className="text-gray-500 mb-6">or use your account</p>
        
        {error && <div className="w-3/4 p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-3/4 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-3/4 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <p className="text-sm text-red-500 cursor-pointer mb-4">
            Forgot your password?
          </p>
          <button 
            disabled={loading}
            type="submit"
            className="w-3/4 p-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 btn-animate disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <InlineLoading size="sm" />}
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        {/* Mobile: Don't have an account? */}
        <div className="flex sm:hidden justify-center items-center w-full mt-4">
          <span className="text-gray-600 mr-2">Don't have an account?</span>
          <Link to="/signup" className="text-red-500 font-semibold underline">Sign up</Link>
        </div>
      </div>

      {/* Right Section: Sign Up */}
      <div className="hidden sm:flex flex-col justify-center items-center sm:w-1/2 bg-gradient-to-r from-red-400 to-red-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
        <p className="text-center mb-8">
          Enter your personal details and start your journey with us
        </p>
        <Link to="/signup" className="w-1/2 p-3 bg-white text-red-600 font-semibold rounded-md hover:bg-gray-100 text-center no-underline btn-animate">
          SIGN UP
        </Link>
      </div>
    </div>
  );
};

export default Login;
