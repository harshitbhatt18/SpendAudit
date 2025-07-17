import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { InlineLoading } from './Loading';
import { supabase } from '../contexts/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('Supabase connection test:', { data, error });
      } catch (error) {
        console.error('Supabase connection failed:', error);
      }
    };
    testConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      console.log('Attempting to sign in with:', email); // Debug log
      
      const { data, error } = await signin(email, password);
      
      console.log('Sign in response:', { data, error }); // Debug log
      
      if (error) {
        console.error('Sign in error:', error); // Debug log
        setError(`Sign in failed: ${error.message}`);
      } else if (data?.user) {
        console.log('Sign in successful, redirecting...'); // Debug log
        navigate('/dashboard');
      } else {
        setError('Sign in failed: No user data received');
      }
    } catch (error) {
      console.error('Sign in exception:', error); // Debug log
      setError(`Failed to sign in: ${error.message || 'Unknown error'}`);
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
    } catch (error) {
      setError('Failed to sign in with Google');
    }
  };
  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      {/* Left Section: Sign In */}
      <div className="flex flex-col justify-center items-center sm:w-1/2 p-8 h-screen bg-white shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Sign In</h1>
        <div className="flex space-x-4 mb-6">
          <img
            src="/Image/google.png"
            alt="Google"
            className="w-10 h-10 cursor-pointer"
            onClick={handleGoogleSignIn}
          />
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
