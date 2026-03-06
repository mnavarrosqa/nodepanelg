import { Activity, Server, Users, Cpu, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Layout } from '../components/Layout';

export function Dashboard() {
  const stats = [
    { label: 'Managed Apps', value: '12', icon: Server, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Active Users', value: '8', icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
    { label: 'Memory Usage', value: '1.2 GB / 4 GB', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'CPU Load', value: '18%', icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  const activities = [
    { id: 1, type: 'status', message: 'Main Website restarted successfully', time: '10 minutes ago', icon: CheckCircle, iconColor: 'text-green-500' },
    { id: 2, type: 'user', message: 'New admin user mnavarro@example.com created', time: '1 hour ago', icon: Users, iconColor: 'text-blue-500' },
    { id: 3, type: 'alert', message: 'API Service high memory usage detected', time: '3 hours ago', icon: AlertCircle, iconColor: 'text-red-500' },
    { id: 4, type: 'deploy', message: 'Version 2.4.1 of Background Worker deployed', time: 'Yesterday', icon: RefreshCw, iconColor: 'text-purple-500' },
  ];

  return (
    <Layout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted">Welcome back, Administrator</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Clock size={18} />
            <span>Logs</span>
          </button>
          <button className="btn-primary">New Application</button>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`mt-1 ${activity.iconColor}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Quick Overview</h2>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity size={12} /> All systems operational
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted">Disk Usage</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted">Node.js Process Count</span>
                <span className="font-bold">24 Running</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted">System Load (1 min)</span>
                <span className="font-bold">0.82</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
