import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { InlineLoading } from './Loading';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const { error } = await signup(email, password, name);
      
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to create an account');
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
    {/* left Section: Welcome Back */}
      <div className="hidden sm:flex flex-col justify-center items-center sm:w-1/2 bg-gradient-to-r from-red-400 to-red-600 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
        <p className="text-center mb-8">
          To keep connected with us please login with your personal info
        </p>
        <Link to="/login" className="w-1/2 p-3 bg-white text-red-600 font-semibold rounded-md hover:bg-gray-100 text-center no-underline btn-animate">
          SIGN IN
        </Link>
      </div>
      {/* Right Section: Sign Up */}
      <div className="flex flex-col justify-center items-center sm:w-1/2 p-8 h-screen bg-white shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Account</h1>
        <div className="flex space-x-4 mb-6">
          <img
            src="/Image/google.png"
            alt="Google"
            className="w-10 h-10 cursor-pointer"
            onClick={handleGoogleSignIn}
          />
        </div>
        <p className="text-gray-500 mb-6">or use your email for registration</p>
        
        {error && <div className="w-3/4 p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-3/4 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-3/4 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button 
            disabled={loading}
            type="submit"
            className="w-3/4 p-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 btn-animate disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <InlineLoading size="sm" />}
            {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </button>
        </form>
        {/* Mobile: Already have an account? */}
        <div className="flex sm:hidden justify-center items-center w-full mt-4">
          <span className="text-gray-600 mr-2">Already have an account?</span>
          <Link to="/login" className="text-red-500 font-semibold underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
