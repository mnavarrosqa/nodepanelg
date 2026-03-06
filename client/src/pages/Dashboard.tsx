import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Server, Users, Cpu, RefreshCw } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import { apiUrl } from '../api';

interface Stats {
  userCount: number;
  appCount: number;
  runningCount: number;
}

export function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/stats'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setStats(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const statCards = stats
    ? [
        { label: 'Applications', value: String(stats.appCount), icon: Server, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Users', value: String(stats.userCount), icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
        { label: 'Running', value: `${stats.runningCount} / ${stats.appCount}`, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
        { label: 'Status', value: stats.appCount === 0 ? '—' : stats.runningCount > 0 ? 'Operational' : 'Stopped', icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-100' },
      ]
    : [
        { label: 'Applications', value: '—', icon: Server, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Users', value: '—', icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
        { label: 'Running', value: '—', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
        { label: 'Status', value: '—', icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-100' },
      ];

  const runningPct = stats && stats.appCount > 0 ? Math.round((stats.runningCount / stats.appCount) * 100) : 0;

  return (
    <Layout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.email ?? 'User'}</p>
        </div>
        <Link to="/apps" className="btn-primary">
          New Application
        </Link>
      </header>

      {loading ? (
        <p className="text-muted">Loading stats...</p>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card flex items-center gap-4">
                  <div className={`p-4 rounded-full ${stat.bg}`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                  <div>
                    <p className="text-muted text-sm">{stat.label}</p>
                    <p className="font-bold text-xl">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {stats && stats.appCount > 0 ? (
                  [
                    { id: 1, message: 'Applications and users are managed from their pages.', icon: RefreshCw, iconColor: 'text-purple-500' },
                    { id: 2, message: 'Go to Applications to start, stop, or edit apps.', icon: Server, iconColor: 'text-blue-500' },
                  ].map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`mt-1 ${a.iconColor}`}>
                          <Icon size={18} />
                        </div>
                        <p className="text-sm font-medium">{a.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted">No activity yet. Add an application to get started.</p>
                )}
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Quick Overview</h2>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${stats && stats.appCount > 0 && stats.runningCount > 0 ? 'text-green-600 bg-green-100' : 'text-muted bg-gray-100'}`}>
                  <Activity size={12} /> {stats && stats.appCount > 0 ? (stats.runningCount > 0 ? 'Apps running' : 'All stopped') : 'No apps'}
                </span>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-muted">Applications running</span>
                    <span className="font-bold">{stats ? `${stats.runningCount} / ${stats.appCount}` : '—'}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-[width]"
                      style={{ width: `${runningPct}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted">
                  Start and stop apps from the Applications page. Data is stored in the panel database.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
