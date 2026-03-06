import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, setupNeeded } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = setupNeeded ? '/api/auth/setup' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-white p-3 rounded-full mb-4 shadow">
            <Cpu className="text-primary" size={40} />
          </div>
          <h1 className="text-2xl font-bold">
            {setupNeeded ? 'Create Admin Account' : 'Sign in to NodePanelG'}
          </h1>
          <p className="text-muted text-sm mt-2">
            {setupNeeded 
              ? 'This is your first time. Please set up the administrator account.' 
              : 'Enter your credentials to access your dashboard'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary mt-4 py-2"
            disabled={loading}
          >
            {loading ? 'Processing...' : (setupNeeded ? 'Complete Setup' : 'Sign In')}
          </button>
        </form>
      </div>
      <p className="mt-6 text-muted text-sm">&copy; 2026 NodePanelG. All rights reserved.</p>
    </div>
  );
}
