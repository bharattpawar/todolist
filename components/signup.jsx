import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/Auth.css';
import { Link } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaTwitter, FaPhone } from 'react-icons/fa';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    console.log('Signing up with:', { name, email, password });
    navigate('/todo'); // Changed from '/' to '/todo'
  };

  const handleSocialSignup = (provider) => {
    console.log(`Signing up with ${provider}`);
    // In a real app, you would implement OAuth here
    navigate('/todo'); // Changed from '/' to '/todo'
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us today!</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
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
              placeholder="Create a password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="social-login-buttons">
          <button 
            type="button" 
            className="social-button google"
            onClick={() => handleSocialSignup('Google')}
          >
            <FcGoogle className="social-icon" /> Continue with Google
          </button>
          
          <button 
            type="button" 
            className="social-button github"
            onClick={() => handleSocialSignup('GitHub')}
          >
            <FaGithub className="social-icon" /> Continue with GitHub
          </button>
          
          <button 
            type="button" 
            className="social-button twitter"
            onClick={() => handleSocialSignup('Twitter')}
          >
            <FaTwitter className="social-icon" /> Continue with Twitter
          </button>
          
          <button 
            type="button" 
            className="social-button phone"
            onClick={() => handleSocialSignup('Phone')}
          >
            <FaPhone className="social-icon" /> Continue with Phone
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;