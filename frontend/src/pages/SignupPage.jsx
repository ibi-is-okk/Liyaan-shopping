import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { registerUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await registerUser(form);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo"><Logo /></div>
        <h2 className="auth-card__title">Create your Account</h2>
        <p className="auth-card__subtitle">Create an account in order<br />to use our services</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" placeholder="Your full name" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Your Email</label>
            <input type="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="form-group--pass">
              <input type={showPass ? "text" : "password"} name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
              <button type="button" className="form-group__eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <div className="form-check">
            <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
            <label>Remember me</label>
          </div>
          <button className="btn-auth" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
