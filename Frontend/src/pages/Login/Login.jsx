import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/Logo.svg";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [error,    setError]      = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem("token",    data.token);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("role",     data.role);
        navigate("/home", { replace: true });
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lg-root">
      <div className="lg-frame">

        {/* ── Left illustration ── */}
        <div className="lg-illustration">
          <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg-svg">
            <rect x="60" y="60" width="260" height="200" rx="18" fill="#1a2340" opacity="0.95"/>
            <circle cx="88" cy="83" r="7" fill="#707b8f"/>
            <circle cx="108" cy="83" r="7" fill="#4a5568"/>
            <circle cx="128" cy="83" r="7" fill="#4a5568"/>
            <rect x="80" y="108" width="160" height="10" rx="5" fill="#2d3d6e"/>
            <rect x="80" y="128" width="120" height="10" rx="5" fill="#2d3d6e"/>
            <rect x="170" y="50" width="130" height="90" rx="12" fill="#7c3aed" opacity="0.9"/>
            <rect x="183" y="68" width="104" height="14" rx="7" fill="rgba(255,255,255,0.3)"/>
            <circle cx="210" cy="63" r="12" fill="rgba(255,255,255,0.15)"/>
            <circle cx="210" cy="60" r="6" fill="rgba(255,255,255,0.5)"/>
            <ellipse cx="210" cy="72" rx="9" ry="5" fill="rgba(255,255,255,0.3)"/>
            {[0,1,2,3,4].map(i=><circle key={i} cx={190+i*14} cy={96} r={4} fill="rgba(183, 174, 174, 0.5)"/>)}
            <rect x="190" y="110" width="70" height="18" rx="9" fill="#a78bfa"/>
            <text x="225" y="123" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="sans-serif">LOGIN</text>
            <rect x="115" y="148" width="48" height="42" rx="8" fill="#7c3aed" opacity="0.85"/>
            <path d="M127 148 C127 134 151 134 151 148" stroke="#7c3aed" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7"/>
            <circle cx="139" cy="165" r="8" fill="#a78bfa"/>
            <rect x="136" y="165" width="6" height="10" rx="3" fill="#7c3aed"/>
            <circle cx="120" cy="290" r="16" fill="#a8c0d6"/>
            <rect x="108" y="306" width="24" height="44" rx="8" fill="#3b5e8c"/>
            <rect x="100" y="320" width="16" height="8" rx="4" fill="#3b5e8c"/>
            <rect x="108" y="350" width="9" height="20" rx="4" fill="#2a4a70"/>
            <rect x="119" y="350" width="9" height="20" rx="4" fill="#2a4a70"/>
            <rect x="83" y="322" width="18" height="26" rx="4" fill="#444d59"/>
            <rect x="85" y="326" width="14" height="18" rx="2" fill="#93c5fd"/>
            <circle cx="320" cy="268" r="16" fill="#a8c0d6"/>
            <rect x="308" y="284" width="24" height="46" rx="8" fill="#2d3748"/>
            <rect x="330" y="298" width="36" height="8" rx="4" fill="#2d3748"/>
            <rect x="308" y="330" width="9" height="22" rx="4" fill="#1a2535"/>
            <rect x="319" y="330" width="9" height="22" rx="4" fill="#1a2535"/>
            <circle cx="364" cy="299" r="5" fill="#a8c0d6"/>
            <ellipse cx="240" cy="320" rx="60" ry="30" fill="#e2f0e8" opacity="0.6" transform="rotate(-20 240 320)"/>
            <ellipse cx="260" cy="310" rx="50" ry="25" fill="#c8e6d0" opacity="0.5" transform="rotate(15 260 310)"/>
            <g transform="translate(148,340)">{[0,45,90,135,180,225,270,315].map((a,i)=><rect key={i} x="-4" y="-22" width="8" height="10" rx="3" fill="#a78bfa" opacity="0.7" transform={`rotate(${a})`}/>)}<circle r="12" fill="#7c3aed" opacity="0.7"/><circle r="5" fill="#4c1d95" opacity="0.7"/></g>
            <g transform="translate(198,358)">{[0,60,120,180,240,300].map((a,i)=><rect key={i} x="-3" y="-16" width="6" height="7" rx="2" fill="#a78bfa" opacity="0.5" transform={`rotate(${a})`}/>)}<circle r="9" fill="#7c3aed" opacity="0.5"/><circle r="4" fill="#4c1d95" opacity="0.5"/></g>
            <circle cx="75" cy="160" r="7" stroke="#a78bfa" strokeWidth="2" fill="none"/>
            <circle cx="55" cy="220" r="5" fill="#a78bfa" opacity="0.4"/>
            <path d="M90 55 Q100 45 110 55 Q120 65 130 55" stroke="#a78bfa" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* ── Right: form side ── */}
        <div className="lg-form-side">

          {/* Logo */}
          <div className="lg-logo-wrap">
            <img src={logoImg} alt="Logo" className="lg-logo-img"
              onError={e=>{ e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
            />
            <div className="lg-logo-fallback" style={{display:"none"}}><span>X</span></div>
          </div>

          {/* Login form */}
          <form className="lg-form" onSubmit={handleLogin}>
            <h2 className="lg-form-title">USER LOGIN</h2>

            <div className="lg-field">
              <i className="fa-solid fa-user lg-field__icon"/>
              <input
                className="lg-input" type="text" placeholder="Username"
                value={loginForm.username}
                onChange={e => setLoginForm(p => ({...p, username: e.target.value}))}
                autoComplete="username"
              />
            </div>

            <div className="lg-field">
              <i className="fa-solid fa-lock lg-field__icon"/>
              <input
                className="lg-input"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={loginForm.password}
                onChange={e => setLoginForm(p => ({...p, password: e.target.value}))}
                autoComplete="current-password"
              />
              <button type="button" className="lg-eye-btn" onClick={() => setShowPass(p => !p)}>
                <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`}/>
              </button>
            </div>

            {error && (
              <div className="lg-error">
                <i className="fa-solid fa-circle-exclamation"/>
                {error}
              </div>
            )}

            <div className="lg-row">
              {/* <label className="lg-remember" onClick={() => setRemember(p => !p)}>
                <span className={`lg-check ${remember ? "lg-check--on" : ""}`}>
                  {remember && <i className="fa-solid fa-check"/>}
                </span>
                Remember
              </label> */}
              <a href="#" className="lg-forgot">Forgot password?</a>
            </div>

            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? <span className="lg-spinner"/> : "LOGIN"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}