import { Bell, Shield, Database, Globe, Save } from 'lucide-react';
import { Layout } from '../components/Layout';

export function Settings() {
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
              <button className="flex items-center gap-3 p-4 bg-gray-50 text-main font-bold border-l-4 border-main">
                <Globe size={18} />
                <span>General</span>
              </button>
              <button className="flex items-center gap-3 p-4 text-muted hover:bg-gray-50 hover:text-main border-l-4 border-transparent">
                <Bell size={18} />
                <span>Notifications</span>
              </button>
              <button className="flex items-center gap-3 p-4 text-muted hover:bg-gray-50 hover:text-main border-l-4 border-transparent">
                <Shield size={18} />
                <span>Security</span>
              </button>
              <button className="flex items-center gap-3 p-4 text-muted hover:bg-gray-50 hover:text-main border-l-4 border-transparent">
                <Database size={18} />
                <span>Database</span>
              </button>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-muted">Panel Name</label>
                  <input type="text" className="input-field" defaultValue="NodePanelG" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-muted">Panel URL</label>
                  <input type="text" className="input-field" defaultValue="http://localhost:3000" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Default Timezone</label>
                <select className="input-field">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">API Configuration</h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              <p className="font-bold mb-1">Warning</p>
              <p>Be careful when modifying API settings. This can disrupt communications between your managed apps and the panel.</p>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">API Token Expiration</label>
                <input type="text" className="input-field" defaultValue="24h" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Webhook Endpoint</label>
                <input type="text" className="input-field" placeholder="https://your-webhook.com" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
