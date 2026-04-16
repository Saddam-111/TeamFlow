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
    <div className="min-h-screen bg-bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="heading-display text-acid-yellow mb-4">TEAMFLOW</h1>
          <p className="text-gray-400 text-lg">CREATE YOUR ACCOUNT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
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
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
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
            <label className="block text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
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
          <span className="text-gray-400">ALREADY HAVE AN ACCOUNT? </span>
          <Link to="/auth/login" className="text-acid-yellow font-bold hover:underline">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
}
