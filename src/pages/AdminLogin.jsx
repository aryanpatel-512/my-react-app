import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://my-react-backend-im39.onrender.com/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      alert("Server Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background elements */}
      <div className="login-bg-noise" />
      <div className="login-bg-grid">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="login-grid-line" style={{ left: `${(i + 1) * 8.33}%` }} />
        ))}
      </div>
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-container">
        <div className="login-card">
          {/* Logo Section */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <img src={logo} alt="Sri Srinivasa" />
            </div>
            <h2>Sri Srinivasa</h2>
            <p>Clean Rooms & Medical Furniture</p>
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span className="divider-line" />
            <span className="divider-text">Admin Access</span>
            <span className="divider-line" />
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6"/>
                    <line x1="21" y1="3" x2="10" y2="14"/>
                    <line x1="3" y1="21" x2="14" y2="10"/>
                  </svg>
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="login-footer">
            <p>Secure Admin Portal</p>
            <div className="login-dots">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        </div>

        {/* Decorative card */}
        <div className="login-info">
          <div className="info-content">
            <span className="info-badge">✦ Admin Portal ✦</span>
            <h3>Manufacturer's Dashboard</h3>
            <p>Manage products, view inquiries, update inventory, and control your medical furniture catalog.</p>
            <div className="info-features">
              <div className="info-feature">
                <span>✓</span>
                <span>Product Management</span>
              </div>
              <div className="info-feature">
                <span>✓</span>
                <span>Order Tracking</span>
              </div>
              <div className="info-feature">
                <span>✓</span>
                <span>Customer Inquiries</span>
              </div>
              <div className="info-feature">
                <span>✓</span>
                <span>Analytics Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
