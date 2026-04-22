import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';
import { authAPI } from '../../services/api.js';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoading(true);

    try {
      const response = await authAPI.register({ username, email, password });
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-black flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-lime-accent/10 rounded-full blur-[100px] glow-sphere" />
      <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-emerald-glow/10 rounded-full blur-[100px] glow-sphere" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <Link to="/" className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-accent flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black" viewBox="0 0 32 32" fill="currentColor">
                <path d="M4 8a4 4 0 014-4h16a4 4 0 010 8H8a4 4 0 01-4-4zM4 16a4 4 0 014-4h8a4 4 0 010 8H8a4 4 0 01-4-4zM4 24a4 4 0 014-4h12a4 4 0 010 8H8a4 4 0 01-4-4z"/>
              </svg>
            </div>
            <span className="font-bold text-2xl sm:text-3xl tracking-tighter text-white group-hover:text-lime-accent transition-colors">
              TEAMFLOW
            </span>
          </Link>
          <h1 className="heading-display text-lime-accent mb-2">GET STARTED</h1>
          <p className="text-white/40 text-sm uppercase tracking-wider">CREATE YOUR ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-mono">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="USERNAME"
              minLength={3}
              maxLength={30}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-mono">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="EMAIL@EXAMPLE.COM"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-2 font-mono">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>

        <div className="text-center mt-8">
          <span className="text-white/40">ALREADY HAVE AN ACCOUNT? </span>
          <Link to="/auth/login" className="text-lime-accent font-bold hover:underline">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
}