import React, { useEffect } from "react";
import "../styles/home.css";

const Home = () => {
  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (!navbar) return;
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fade-in sections on scroll
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <>
      <nav className="navbar">
        <a href="#" className="nav-logo">
          ⚒️ <span>PlanForge</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it Works</a>
          <a href="#features">Features</a>
          <a href="#contact" className="nav-link-secondary">
            Contact
          </a>
          <a href="/login" className="nav-link-secondary">
            Login
          </a>
          <a href="/login" className="nav-link-primary">
            Sign Up
          </a>
        </div>
      </nav>

      <header className="hero" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-blur-pill hero-pill-left"></div>
        <div className="hero-blur-pill hero-pill-right"></div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span className="hero-badge-text">
              Your Personal Productivity Command Center
            </span>
          </div>

          <h1 className="hero-title">Achieve More, Stress Less.</h1>
          <p className="hero-subtitle">
            The ultimate task manager to organize your life and work — from the
            smallest details to the biggest projects.
          </p>

          <div className="hero-actions">
            <a href="/login" className="hero-button hero-button-primary">
              Get Started Free
            </a>
            <a href="#features" className="hero-button hero-button-ghost">
              Explore Features
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">2x</span>
              <span className="hero-stat-label">More Organized</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">50%</span>
              <span className="hero-stat-label">Less Chaos</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">24/7</span>
              <span className="hero-stat-label">Task Support</span>
            </div>
          </div>
        </div>
      </header>

      <section
        className="page-section fade-in-section"
        id="how-it-works"
      >
        <div className="section-header">
          <h2>Get Organized in 3 Easy Steps</h2>
          <p>Start managing your tasks in minutes — no setup headaches.</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Create a Task</h3>
            <p>
              Quickly add new tasks with titles, descriptions, due dates, and
              priority levels.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Organize &amp; Prioritize</h3>
            <p>
              Use filters and categories to sort your tasks and focus on what
              matters most.
            </p>
          </div>
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Achieve Your Goals</h3>
            <p>
              Mark tasks as complete and track your progress with insightful
              stats.
            </p>
          </div>
        </div>
      </section>

      <main
        className="features-section fade-in-section"
        id="features"
      >
        <div className="section-header">
          <h2>Everything You Need, All in One Place</h2>
          <p>
            PlanForge is packed with powerful features to boost your productivity.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19.4,3.9c-0.4-0.4-1-0.4-1.4,0l-12,12l-2.3,6.5l6.5-2.3l12-12C19.8,4.9,19.8,4.3,19.4,3.9z M6.9,18.2l-1.1-1.1l1.4-4 l1.1,1.1L6.9,18.2z M18,8.4L15.6,6l1.4-1.4l2.4,2.4L18,8.4z" />
              </svg>
            </div>
            <h3>Manage Tasks</h3>
            <p>Easily create, modify, and delete your tasks on the fly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19,4h-1V2h-2v2H8V2H6v2H5C3.9,4,3,4.9,3,6v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,20H5V9h14V20z M19,7H5V6h14V7z" />
              </svg>
            </div>
            <h3>Calendar View</h3>
            <p>Visualize your schedule and never miss a deadline.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M9,16.2L4.8,12l-1.4,1.4L9,19L21,7l-1.4-1.4L9,16.2z" />
              </svg>
            </div>
            <h3>Prioritize Tasks</h3>
            <p>Group tasks by projects like “Work” or “Personal”.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12,22c1.1,0,2-0.9,2-2h-4C10,21.1,10.9,22,12,22z M18,16v-5c0-3.1-2.2-5.6-5-6.3V4c0-0.6-0.4-1-1-1s-1,0.4-1,1v0.7 C7.2,5.4,5,7.9,5,11v5l-2,2v1h18v-1L18,16z" />
              </svg>
            </div>
            <h3>Notes & Reminders</h3>
            <p>Capture ideas and get timely nudges so you never forget.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M10,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8c0-1.1-0.9-2-2-2h-8L10,4z" />
              </svg>
            </div>
            <h3>To-Do Boards</h3>
            <p>See your to-dos in a simple list or board layout.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z M12.5,7H11v6l5.2,3.1l0.8-1.2l-4.5-2.7V7z" />
              </svg>
            </div>
            <h3>Focus Breaks</h3>
            <p>Take a break and sharpen your mind with a fun game.</p>
          </div>
        </div>
      </main>

      <section className="testimonial-section fade-in-section">
        <div className="testimonial-content">
          <p className="quote">
            “PlanForge has completely transformed how I manage my projects. It’s
            simple, powerful, and beautiful to use. I can’t imagine my workflow
            without it.”
          </p>
          <p className="author">— Alex Johnson, Project Manager</p>
        </div>
      </section>

      <section className="cta-section fade-in-section" id="contact">
        <h2>Ready to Boost Your Productivity?</h2>
        <p>Join thousands of users who are organizing their lives with PlanForge.</p>
        <a href="/login" className="cta-button">
          Sign Up for Free
        </a>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">⚒️ PlanForge</div>
          <div className="footer-links">
            <a href="#how-it-works">How it Works</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-socials">
            <a href="#">X</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
        <p className="footer-copy">&copy; 2025 PlanForge. All rights reserved.</p>
      </footer>
    </>
  );
};
export default Home;
