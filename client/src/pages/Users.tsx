import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, User as UserIcon, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useAuth } from '../components/AuthContext';

interface UserData {
  id: number;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { token, user: currentUser } = useAuth();

  // Add User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail, password: newPassword })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add user');
      }
      setShowAddModal(false);
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      alert('You cannot delete yourself!');
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <Layout>
        <div className="card text-center p-6">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p className="text-muted">Only administrators can manage users.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted">Manage system administrators and regular users</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Add User</span>
        </button>
      </header>

      {loading ? (
        <div className="text-center p-6">Loading users...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-6">{error}</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-bold text-muted">User</th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-bold text-muted">Role</th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-bold text-muted">Joined</th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider font-bold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <UserIcon size={16} className="text-muted" />
                      </div>
                      <span className="font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      <span className="flex items-center gap-1">
                        {u.role === 'admin' && <Shield size={12} />}
                        {u.role}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== 1 && (
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="btn-danger"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="card w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-main"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  required 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted">Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary mt-2"
                disabled={addLoading}
              >
                {addLoading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
