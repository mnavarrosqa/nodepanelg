import { Activity, Server, Users, DollarSign } from 'lucide-react';
import { Layout } from '../components/Layout';

export function Dashboard() {
  const stats = [
    { label: 'Total Apps', value: '12', icon: Server, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Active Users', value: '450', icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'System Load', value: '24%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Revenue', value: '$12,450', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  ];

  return (
    <Layout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted">Welcome back, Administrator</p>
        </div>
        <button className="btn-primary">New Application</button>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => {
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

      <div className="card mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-muted">
          No recent activity found.
        </div>
      </div>
    </Layout>
  );
}
