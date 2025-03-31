import React from 'react';
import '../styles/Homepage.css';
import { Link } from 'react-router';  // ✅ Import Link for navigation
import { FiCheck, FiPlus, FiTrash2, FiFlag, FiArrowRight } from 'react-icons/fi';

const Homepage = () => {
  return (
    <div className="modern-homepage">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Organize Your Tasks with </h1>
          <p>The modern task management app with priority levels and intuitive filtering</p>
          <div className="cta-buttons">
             <Link to="/todo" className="primary-button">
              Get Started <span><FiArrowRight /></span>
            </Link>
            <a href="#features" className="secondary-button">
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Why Choose TaskFlow</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FiFlag className="feature-icon" />
            <h3>Priority Levels</h3>
            <p>Organize tasks with high, medium, and low priority flags to focus on what matters most</p>
          </div>
          <div className="feature-card">
            <FiCheck className="feature-icon" />
            <h3>Smart Filtering</h3>
            <p>Easily filter tasks by status (active/completed) or priority level</p>
          </div>
          <div className="feature-card">
            <FiPlus className="feature-icon" />
            <h3>Quick Add</h3>
            <p>Add tasks with priority levels in seconds with our streamlined input</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="testimonial-content">
          <blockquote>
            "TaskFlow's priority system helped me focus on critical tasks first. I'm completing 30% more important tasks each week!"
          </blockquote>
          <div className="author">- Bharat Pawar</div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
