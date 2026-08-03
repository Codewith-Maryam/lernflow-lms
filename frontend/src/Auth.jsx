import { useState } from "react";
import axios from "axios";


// ─── Shared Styles ────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh", background: "#f1f5f9",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "system-ui, sans-serif", padding: 20,
  },
  card: {
    background: "#fff", borderRadius: 12, padding: 28,
    border: "1px solid #e2e8f0", width: "100%", maxWidth: 400,
  },
  logo: {
    width: 44, height: 44, background: "#2563eb", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, color: "#fff", fontSize: 20, margin: "0 auto 10px",
  },
  input: {
    width: "100%", border: "1px solid #d1d5db", borderRadius: 7,
    padding: "10px 12px", fontSize: 13, outline: "none",
    boxSizing: "border-box", color: "#1e293b",
  },
  btn: {
    width: "100%", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 7, padding: 11,
    fontWeight: 600, fontSize: 14, cursor: "pointer",
  },
  error: {
    background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 7, padding: "10px 14px",
    marginBottom: 16, fontSize: 13, color: "#dc2626",
  },
  label: {
    display: "block", fontSize: 12,
    fontWeight: 600, color: "#374151", marginBottom: 6,
  },
};

// ─── Reusable Field ───────────────────────────────────────────
function Field({ label, type, placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={s.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={s.input}
        onFocus={e => (e.target.style.borderColor = "#2563eb")}
        onBlur={e => (e.target.style.borderColor = "#d1d5db")}
      />
    </div>
  );
}

// ─── Logo Block ───────────────────────────────────────────────
function Logo({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={s.logo}>L</div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px", color: "#1e293b" }}>
        {title}
      </h1>
      <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{subtitle}</p>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────
export function Login({ onSuccess, onRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    if (!email || !password) return setError("Please fill in all fields.");

    setLoading(true);
    setError("");

    // Simulate API call — replace with: axios.post('/api/login', { email, password })
    setTimeout(() => {
      if (email === "admin@lms.com" && password === "password") {
        onSuccess("admin");
      } else if (email === "student@lms.com" && password === "password") {
        onSuccess("student");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
        // Install axios first: npm install axios

async function handleLogin() {
  if (!email || !password) return setError("Please fill in all fields.");
  setLoading(true);
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/api/login", { email, password });
    localStorage.setItem("token", res.data.token);  // save Sanctum token
    onSuccess(res.data.user.role);                   // pass role to parent
  } catch (err) {
    setError(err.response?.data?.message || "Login failed.");
    setLoading(false);
  }
}
      }
    }, 800);
  }

  return (
    <div style={s.page}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Logo title="Welcome back" subtitle="Log in to your LearnFlow account" />

        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}

          <Field label="Email address" type="email" placeholder="you@example.com"
            value={email} onChange={setEmail} />
          <Field label="Password" type="password" placeholder="••••••••"
            value={password} onChange={setPassword} />

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...s.btn, background: loading ? "#93c5fd" : "#2563eb", marginBottom: 12 }}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          {/* Demo credentials hint */}
          <div style={{ background: "#eff6ff", borderRadius: 7, padding: "10px 12px", fontSize: 12, color: "#1d4ed8" }}>
            <strong>Demo:</strong> admin@lms.com / password<br />
            <strong>Demo:</strong> student@lms.com / password
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 16 }}>
          Don't have an account?{" "}
          <span onClick={onRegister} style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>
            Register here
          </span>
        </p>
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
          <span onClick={onBack} style={{ cursor: "pointer" }}>← Back to home</span>
        </p>
      </div>
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────
export function Register({ onSuccess, onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegister() {
    if (!name || !email || !password) return setError("Please fill in all fields.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    setError("");

    // Simulate API call — replace with: axios.post('/api/register', { name, email, password, role })
    setTimeout(() => {
      onSuccess(role);
    }, 800);
    async function handleRegister() {
  if (!name || !email || !password) return setError("Please fill in all fields.");
  if (password.length < 6) return setError("Password must be at least 6 characters.");
  setLoading(true);
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/api/register", { name, email, password, role });
    localStorage.setItem("token", res.data.token);
    onSuccess(res.data.user.role);
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed.");
    setLoading(false);
  }
}
  }

  return (
    <div style={s.page}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Logo title="Create account" subtitle="Join LearnFlow today" />

        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}

          <Field label="Full Name" type="text" placeholder="e.g. Maryam"
            value={name} onChange={setName} />
          <Field label="Email address" type="email" placeholder="you@example.com"
            value={email} onChange={setEmail} />
          <Field label="Password" type="password" placeholder="min. 6 characters"
            value={password} onChange={setPassword} />

          {/* Role Selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>I am a...</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["student", "admin"].map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    flex: 1, padding: 9, borderRadius: 7, fontSize: 13,
                    fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                    background: role === r ? "#2563eb" : "#f8fafc",
                    color: role === r ? "#fff" : "#64748b",
                    border: role === r ? "none" : "1px solid #e2e8f0",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{ ...s.btn, background: loading ? "#93c5fd" : "#2563eb" }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 16 }}>
          Already have an account?{" "}
          <span onClick={onLogin} style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>
            Log in
          </span>
        </p>
        <p style={{ textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
          <span onClick={onBack} style={{ cursor: "pointer" }}>← Back to home</span>
        </p>
      </div>
    </div>
  );
}