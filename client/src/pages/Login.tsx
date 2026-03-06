import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just redirect to dashboard
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-white p-3 rounded-full mb-4 shadow">
            <Cpu className="text-primary" size={40} />
          </div>
          <h1 className="text-2xl font-bold">Sign in to NodePanelG</h1>
          <p className="text-muted text-sm mt-2">Enter your credentials to access your dashboard</p>
        </div>

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

          <button type="submit" className="btn-primary mt-4 py-2">
            Sign In
          </button>
        </form>
      </div>
      <p className="mt-6 text-muted text-sm">&copy; 2026 NodePanelG. All rights reserved.</p>
    </div>
  );
}
