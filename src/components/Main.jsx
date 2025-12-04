import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Main.css";
import videoBg from "../assets/background-video2.mp4";

const Main = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load logged-in user and email from localStorage
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setUsername(loggedInUser);
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = users.find(u => u.username === loggedInUser);
      if (currentUser) setEmail(currentUser.email);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  // User initial for avatar
  const avatarInitial = username ? username.charAt(0).toUpperCase() : "";

  return (
    <div className="main-page">
      {/* Background video */}
      <video
        className="background-video"
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Navbar */}
      <header>
        <nav className="navbar">
          <div className="nav-logo">
            <span className="logo-icon">⚒</span> PlanForge
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/mansi">Tasks</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/notes">Notes</Link></li> 
            {/* Profile avatar and dropdown */}
            <li className="nav-profile">
              <div 
                className="avatar" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {avatarInitial}
              </div>
              {isDropdownOpen && (
                <div className="profile-dropdown" ref={dropdownRef}>
                  <div className="avatar-large">{avatarInitial}</div>
                  <div className="profile-name">{username}</div>
                  <div className="profile-email">{email}</div>
                  <button 
                    className="logout-btn profile-logout-btn" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content */}
      <main className="main-content">
        <h1>Welcome {username || "to your Task Manager Dashboard"} 👋</h1>
        <p>Manage all your tasks efficiently.</p>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <p>&copy; 2025 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main;