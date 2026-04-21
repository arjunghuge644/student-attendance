import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Shield, AlertCircle, X, Building2, Mail, Terminal } from "lucide-react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const IS_CONFIGURED = CLIENT_ID && !CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID_HERE");

export default function Login() {
  const { handleGoogleSuccess, handleGoogleError, loginAsGuest, loginAsFaculty, authError, clearError, ALLOWED_DOMAIN } = useAuth();
  const [hovering, setHovering] = useState(false);

  return (
    <div className="login-page">
      {/* Background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-container">
        {/* Left panel — branding */}
        <div className="login-left">
          <div className="login-brand">
            <div className="login-logo">
              <GraduationCap size={34} color="#fff" />
            </div>
            <h1 className="login-brand-name">AttendX</h1>
          </div>

          <div className="login-headline">
            <h2>Smart Attendance,<br />Simplified.</h2>
            <p>A modern attendance management system built exclusively for Modern College of Engineering faculty.</p>
          </div>

          <div className="login-features">
            {[
              { icon: "📊", text: "Real-time attendance dashboard" },
              { icon: "📋", text: "Mark & manage FY · SE · TE · BE" },
              { icon: "📈", text: "Analytics & reports at a glance" },
              { icon: "🔐", text: "College-only secure access" },
            ].map(({ icon, text }) => (
              <div key={text} className="login-feature-item">
                <span className="login-feature-icon">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="login-college">
            <Building2 size={14} />
            <span>Modern College of Engineering, Pune</span>
          </div>
        </div>

        {/* Right panel — sign-in form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-header">
              <div className="login-card-icon">
                <Shield size={22} color="var(--accent-light)" />
              </div>
              <h3>Faculty Sign In</h3>
              <p>Use your college Google account to continue</p>
            </div>

            {/* Domain badge */}
            <div className="login-domain-badge">
              <Mail size={13} />
              <span>Only <strong>@{ALLOWED_DOMAIN}</strong> accounts are permitted</span>
            </div>

            {/* Error message */}
            {authError && (
              <div className="login-error">
                <AlertCircle size={15} />
                <span>{authError}</span>
                <button className="login-error-close" onClick={clearError}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Google Sign In Button */}
            <div className="login-google-wrap" style={{ flexDirection: "column", gap: "12px" }}>
              {!IS_CONFIGURED && (
                <div style={{ 
                  background: "rgba(245, 158, 11, 0.1)", 
                  border: "1px dashed #f59e0b", 
                  borderRadius: "10px", 
                  padding: "12px", 
                  fontSize: "12px",
                  color: "#f59e0b",
                  marginBottom: "8px",
                  textAlign: "center"
                }}>
                  <Terminal size={14} style={{ marginBottom: "4px" }} />
                  <div><strong>Developer Notice:</strong> Google OAuth ID not found in .env. Use bypass below to test UI.</div>
                </div>
              )}
              
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="filled_black"
                size="large"
                width="340"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />

              <div className="login-divider">
                <span>OR</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, justifyContent: "center", borderStyle: "dashed", opacity: 0.8, fontSize: "12px" }}
                  onClick={loginAsGuest}
                >
                  Admin Guest
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, justifyContent: "center", borderStyle: "dashed", opacity: 0.8, fontSize: "12px" }}
                  onClick={loginAsFaculty}
                >
                  Faculty Guest
                </button>
              </div>
            </div>


            <div className="login-info-box">
              <p>
                🎓 Sign in using your college-issued Google account ending in{" "}
                <strong className="login-domain-highlight">@{ALLOWED_DOMAIN}</strong>.
                Personal Gmail accounts will be rejected.
              </p>
            </div>

            <div className="login-footer-text">
              <span>Having trouble? Contact your IT administrator.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
