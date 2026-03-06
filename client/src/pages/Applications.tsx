import { Server, Plus, Power, Activity, ExternalLink } from 'lucide-react';
import { Layout } from '../components/Layout';

interface Application {
  id: number;
  name: string;
  status: 'running' | 'stopped' | 'error';
  port: number;
  uptime: string;
}

export function Applications() {
  const apps: Application[] = [
    { id: 1, name: 'Main Website', status: 'running', port: 8080, uptime: '12d 4h' },
    { id: 2, name: 'API Service', status: 'running', port: 3001, uptime: '5d 22h' },
    { id: 3, name: 'Background Worker', status: 'stopped', port: 4000, uptime: '0s' },
  ];

  return (
    <Layout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted">Manage and monitor your Node.js applications</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Deploy App</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="card flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${app.status === 'running' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{app.name}</h3>
                  <p className="text-xs text-muted uppercase tracking-wider">Port: {app.port}</p>
                </div>
              </div>
              <span className={`badge ${app.status === 'running' ? 'badge-user' : 'badge-admin'} py-1 px-2 text-[10px]`}>
                {app.status}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted">
              <div className="flex items-center gap-1">
                <Activity size={14} />
                <span>{app.uptime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button className={`flex-1 py-2 rounded text-sm font-medium border ${app.status === 'running' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                <span className="flex items-center justify-center gap-1">
                  <Power size={14} />
                  {app.status === 'running' ? 'Stop' : 'Start'}
                </span>
              </button>
              <button className="p-2 border rounded text-muted hover:bg-gray-50">
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
