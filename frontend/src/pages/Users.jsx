import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'base_commander', label: 'Base Commander' },
  { value: 'logistics_officer', label: 'Logistics Officer' }
];

export default function Users() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: '', assignedBase: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    async function fetchUsers() {
      setLoading(true);
      const [usersRes, basesRes] = await Promise.all([
        fetch(`${apiUrl}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/bases`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(await usersRes.json());
      setBases(await basesRes.json());
      setLoading(false);
    }
    fetchUsers();
  }, [token, user, status]);

  if (user?.role !== 'admin') return <div>Access denied.</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const filteredUsers = users.filter(u =>
    (!search || u.username.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  );

  const handleEdit = (u) => {
    setEditUser(u);
    setForm({
      username: u.username,
      password: '',
      role: u.role,
      assignedBase: u.assignedBase?._id || u.assignedBase || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(''); setError('');
    try {
      let res;
      if (editUser) {
        res = await fetch(`${apiUrl}/users/${editUser.id || editUser._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`${apiUrl}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to save user');
      setStatus(editUser ? 'User updated!' : 'User added!');
      setShowModal(false);
      setEditUser(null);
      setForm({ username: '', password: '', role: '', assignedBase: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setStatus(''); setError('');
    try {
      const res = await fetch(`${apiUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete user');
      setStatus('User deleted!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="users-page">
      <h2>Users</h2>
      <button onClick={() => setShowModal(true)}>Add User</button>
      <div style={{display:'flex',gap:'1rem',marginBottom:'1rem'}}>
        <input placeholder="Search username..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>
      {status && <div className="status">{status}</div>}
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Assigned Base</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id || u._id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.assignedBase?.name || ''}</td>
                <td>
                  <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                    <button style={{background:'#3e5ba9',color:'#fff',padding:'0.35rem 1.1rem',borderRadius:'6px',border:'none',cursor:'pointer'}} onClick={() => handleEdit(u)}>Edit</button>
                    <button style={{background:'#ff4d4f',color:'#fff',padding:'0.35rem 1.1rem',borderRadius:'6px',border:'none',cursor:'pointer'}} onClick={() => handleDelete(u.id || u._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h3>{editUser ? 'Edit User' : 'Add User'}</h3>
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
            <input name="password" type="password" placeholder={editUser ? "New Password (leave blank to keep)" : "Password"} value={form.password} onChange={handleChange} required={!editUser} />
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <select name="assignedBase" value={form.assignedBase} onChange={handleChange} required={form.role !== 'admin'}>
              <option value="">Select Base</option>
              {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => { setShowModal(false); setEditUser(null); setForm({ username: '', password: '', role: '', assignedBase: '' }); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 