import { useState, useEffect } from 'react';
import { Bell, Shield, Database, Globe, Save } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../components/AuthContext';
import { apiUrl } from '../api';

type Section = 'general' | 'notifications' | 'security' | 'database';

export function Settings() {
  const { token, user } = useAuth();
  const [section, setSection] = useState<Section>('general');
  const [panelName, setPanelName] = useState('NodePanelG');
  const [panelUrl, setPanelUrl] = useState('http://localhost:3000');
  const [timezone, setTimezone] = useState('UTC');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/settings'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setPanelName(data.panelName ?? 'NodePanelG');
          setPanelUrl(data.panelUrl ?? 'http://localhost:3000');
          setTimezone(data.timezone ?? 'UTC');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'admin') return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(apiUrl('/api/settings'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          panelName: panelName.trim(),
          panelUrl: panelUrl.trim(),
          timezone,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const sections: { id: Section; icon: typeof Globe; label: string }[] = [
    { id: 'general', icon: Globe, label: 'General' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'database', icon: Database, label: 'Database' },
  ];

  return (
    <Layout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted">Configure your NodePanelG instance and system defaults</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card p-0 overflow-hidden sticky top-6">
            <nav className="flex flex-col">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = section === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSection(s.id)}
                    className={`flex items-center gap-3 p-4 text-left border-l-4 transition-colors ${
                      isActive ? 'bg-gray-50 text-main font-bold border-main' : 'text-muted hover:bg-gray-50 hover:text-main border-transparent'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {section === 'general' && (
            <>
              <div className="card">
                <h2 className="text-xl font-bold mb-4">General Settings</h2>
                {message && (
                  <div
                    className={`p-3 rounded mb-4 text-sm ${
                      message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {message.text}
                  </div>
                )}
                {loading ? (
                  <p className="text-muted">Loading...</p>
                ) : (
                  <form onSubmit={handleSaveGeneral} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-muted">Panel Name</label>
                        <input
                          type="text"
                          className="input-field"
                          value={panelName}
                          onChange={(e) => setPanelName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-muted">Panel URL</label>
                        <input
                          type="text"
                          className="input-field"
                          value={panelUrl}
                          onChange={(e) => setPanelUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-muted">Default Timezone</label>
                      <select
                        className="input-field"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York">EST (Eastern)</option>
                        <option value="America/Los_Angeles">PST (Pacific)</option>
                        <option value="Europe/London">GMT (London)</option>
                      </select>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
                          <Save size={18} />
                          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
              <div className="card">
                <h2 className="text-xl font-bold mb-4">API Configuration</h2>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                  <p className="font-bold mb-1">Warning</p>
                  <p>Be careful when modifying API settings. This can disrupt communications between your managed apps and the panel.</p>
                </div>
                <p className="mt-4 text-sm text-muted">API token expiration and webhooks can be added in a future update.</p>
              </div>
            </>
          )}
          {(section === 'notifications' || section === 'security' || section === 'database') && (
            <div className="card">
              <p className="text-muted">This section is not implemented yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
