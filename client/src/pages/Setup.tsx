import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { apiUrl } from '../api';

export function Setup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setupNeeded, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }
  if (!setupNeeded) return <Navigate to="/login" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/setup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
      if (!res.ok) {
        if (res.status === 400 && data.error === 'Setup already completed') {
          navigate('/login');
          return;
        }
        if (res.status === 404) {
          setError('API not reachable. Run "npm run dev" from the project root (starts both server and client).');
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Setup failed');
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
          <h1 className="text-2xl font-bold">Create Admin Account</h1>
          <p className="text-muted text-sm mt-2">First-time setup. Choose an email and password for the administrator.</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-muted">Email</label>
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
          <button type="submit" className="btn-primary mt-4 py-2" disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
