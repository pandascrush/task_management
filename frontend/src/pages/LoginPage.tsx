import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LuShieldCheck, LuMail, LuLock, LuEye, LuEyeOff } from 'react-icons/lu';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated && user) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate(userData.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow login-glow-1"></div>
      <div className="login-glow login-glow-2"></div>

      <div className="login-card animate-in">
        <div className="login-brand">
          <div className="login-logo">
            <LuShieldCheck size={36} />
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error shake">{error}</div>}

          <div className="input-group">
            <span className="input-icon"><LuMail size={18} /></span>
            <input
              id="login-email"
              type="email"
              className="input-field with-icon"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <span className="input-icon"><LuLock size={18} /></span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input-field with-icon"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="input-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full"
            disabled={loading}
            id="btn-login"
          >
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo: <code>admin@admin.com</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
