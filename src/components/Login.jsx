import React, { useState } from "react";
import "../styles/login.css";
const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });

  const toggleForm = () => setIsActive(!isActive);

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8 && password.length <= 16;
    const uppercaseCheck = /[A-Z]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return lengthCheck && uppercaseCheck && specialCharCheck;
  };
  const validateEmail = (email) =>
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email.toLowerCase());
  const handleRegister = (e) => {//registration form submission 
    e.preventDefault();
    const { username, email, password } = registerData;
    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid lowercase email with @ sign.");
      return;
    }
    if (!validatePassword(password)) {
      alert(
        "Password must be 8-16 characters, include at least 1 uppercase letter and 1 special character."
      );
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = existingUsers.some(
      (user) => user.email === email.toLowerCase()
    );
    if (emailExists) {
      alert("This email is already registered. Please use a different one.");
      return;
    }
    const newUser = { username, email: email.toLowerCase(), password };
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Registered successfully! Now login.");
    setIsActive(false);
    setRegisterData({ username: "", email: "", password: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = loginData;
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = savedUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      alert("Login successful!");
      localStorage.setItem("loggedInUser", username);
      window.location.href = "/main"; // redirect to dashboard
    } else {
      alert("Invalid username or password.");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form className="form" onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="username"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              required
            />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="forget-link">
            <a href="#">Forgot Password</a>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
      <div className="form-box register">
        <form className="form" onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="username"
              value={registerData.username}
              onChange={(e) =>
                setRegisterData({ ...registerData, username: e.target.value })
              }
              required
            />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="E-mail"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <button type="submit" className="btn">
            Register
          </button>
        </form>
      </div>
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button className="btn register-btn" onClick={toggleForm}>
            Register
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button className="btn login-btn" onClick={toggleForm}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;