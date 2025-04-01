import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/Auth.css';
import { Link } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaTwitter, FaPhone } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    console.log('Logging in with:', { email, password });
    navigate('/todo'); // Changed from '/' to '/todo'
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // In a real app, you would implement OAuth here
    navigate('/todo'); // Changed from '/' to '/todo'
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to access your account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="auth-button">Login</button>
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="social-login-buttons">
          <button 
            type="button" 
            className="social-button google"
            onClick={() => handleSocialLogin('Google')}
          >
            <FcGoogle className="social-icon" /> Continue with Google
          </button>
          
          <button 
            type="button" 
            className="social-button github"
            onClick={() => handleSocialLogin('GitHub')}
          >
            <FaGithub className="social-icon" /> Continue with GitHub
          </button>
          
          <button 
            type="button" 
            className="social-button twitter"
            onClick={() => handleSocialLogin('Twitter')}
          >
            <FaTwitter className="social-icon" /> Continue with Twitter
          </button>
          
          <button 
            type="button" 
            className="social-button phone"
            onClick={() => handleSocialLogin('Phone')}
          >
            <FaPhone className="social-icon" /> Continue with Phone
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;