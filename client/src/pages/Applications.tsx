import { useState, useEffect } from 'react';
import { Server, Plus, Power, Activity, ExternalLink, Trash2, X, Pencil } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import { apiUrl } from '../api';

interface Application {
  id: number;
  name: string;
  status: 'running' | 'stopped' | 'error';
  port: number | null;
  scriptPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const { token } = useAuth();

  const [formName, setFormName] = useState('');
  const [formPort, setFormPort] = useState('');
  const [formScriptPath, setFormScriptPath] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchApps = async () => {
    try {
      const res = await fetch(apiUrl('/api/apps'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApps(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [token]);

  const openAdd = () => {
    setFormName('');
    setFormPort('');
    setFormScriptPath('');
    setEditingApp(null);
    setShowAddModal(true);
  };

  const openEdit = (app: Application) => {
    setEditingApp(app);
    setFormName(app.name);
    setFormPort(app.port != null ? String(app.port) : '');
    setFormScriptPath(app.scriptPath ?? '');
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingApp(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      const port = formPort.trim() ? parseInt(formPort, 10) : undefined;
      if (editingApp) {
        const res = await fetch(apiUrl(`/api/apps/${editingApp.id}`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formName.trim(),
            port: port ?? null,
            scriptPath: formScriptPath.trim() || null,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Update failed');
        }
      } else {
        const res = await fetch(apiUrl('/api/apps'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formName.trim(),
            port,
            scriptPath: formScriptPath.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Create failed');
        }
      }
      closeModal();
      fetchApps();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (app: Application) => {
    const next = app.status === 'running' ? 'stopped' : 'running';
    try {
      const res = await fetch(apiUrl(`/api/apps/${app.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchApps();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (app: Application) => {
    if (!confirm(`Delete "${app.name}"?`)) return;
    try {
      const res = await fetch(apiUrl(`/api/apps/${app.id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchApps();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const uptimeDisplay = (app: Application) => {
    if (app.status !== 'running') return '0s';
    const created = new Date(app.updatedAt).getTime();
    const now = Date.now();
    const sec = Math.floor((now - created) / 1000);
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    return `${Math.floor(sec / 86400)}d`;
  };

  return (
    <Layout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-muted">Manage and monitor your Node.js applications</p>
        </div>
        <button type="button" onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Deploy App</span>
        </button>
      </header>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-6">{error}</div>
      )}

      {loading ? (
        <div className="text-center p-6">Loading applications...</div>
      ) : apps.length === 0 ? (
        <div className="card text-center p-12">
          <Server className="mx-auto text-muted mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">No applications yet</h2>
          <p className="text-muted mb-4">Add your first app to get started.</p>
          <button type="button" onClick={openAdd} className="btn-primary flex items-center gap-2 mx-auto">
            <Plus size={18} />
            <span>Deploy App</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div key={app.id} className="card flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      app.status === 'running' ? 'bg-green-100 text-green-600' : app.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Server size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{app.name}</h3>
                    <p className="text-xs text-muted uppercase tracking-wider">
                      {app.port != null ? `Port: ${app.port}` : 'No port'}
                    </p>
                  </div>
                </div>
                <span
                  className={`badge ${app.status === 'running' ? 'badge-user' : app.status === 'error' ? 'bg-red-100 text-red-700' : 'badge-admin'} py-1 px-2 text-[10px]`}
                >
                  {app.status}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted">
                <div className="flex items-center gap-1">
                  <Activity size={14} />
                  <span>{uptimeDisplay(app)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(app)}
                  className={`flex-1 py-2 rounded text-sm font-medium border ${
                    app.status === 'running'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-green-50 text-green-600 border-green-200'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <Power size={14} />
                    {app.status === 'running' ? 'Stop' : 'Start'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(app)}
                  className="p-2 border rounded text-muted hover:bg-gray-50"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                {app.port != null && (
                  <a
                    href={`http://localhost:${app.port}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border rounded text-muted hover:bg-gray-50"
                    title="Open"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(app)}
                  className="p-2 border rounded text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="card w-full max-w-md p-6 relative">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-muted hover:text-main"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingApp ? 'Edit Application' : 'Deploy App'}
            </h2>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="My App"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Port (optional)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formPort}
                  onChange={(e) => setFormPort(e.target.value)}
                  placeholder="3000"
                  min={1}
                  max={65535}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Script path (optional)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formScriptPath}
                  onChange={(e) => setFormScriptPath(e.target.value)}
                  placeholder="/path/to/app.js"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Saving...' : editingApp ? 'Save' : 'Create'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
