import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Bases() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', description: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [editBase, setEditBase] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    async function fetchBases() {
      setLoading(true);
      const res = await fetch(`${apiUrl}/bases`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBases(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchBases();
  }, [token, user, status]);

  if (user?.role !== 'admin') return <div>Access denied.</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (base) => {
    setEditBase(base);
    setForm({ name: base.name, location: base.location, description: base.description });
    setShowModal(true);
  };

  const handleDelete = async (baseId) => {
    if (!window.confirm('Are you sure you want to delete this base?')) return;
    setStatus(''); setError('');
    try {
      const res = await fetch(`${apiUrl}/bases/${baseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete base');
      setStatus('Base deleted!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(''); setError('');
    try {
      let res;
      if (editBase) {
        res = await fetch(`${apiUrl}/bases/${editBase._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`${apiUrl}/bases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to save base');
      setStatus(editBase ? 'Base updated!' : 'Base added!');
      setShowModal(false);
      setEditBase(null);
      setForm({ name: '', location: '', description: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{maxWidth:900,margin:'2.5rem auto 0 auto',padding:'0 1rem'}}>
      <h2 style={{fontWeight:700,marginBottom:'1.5rem',color:'#232946',textAlign:'left'}}>Bases</h2>
      <button className="add-btn" onClick={() => setShowModal(true)}>Add Base</button>
      {status && <div className="status">{status}</div>}
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div style={{overflowX:'auto',marginBottom:'2.5rem'}}>
          <table style={{width:'100%',borderCollapse:'collapse',color:'#232946',fontSize:'1.05rem',background:'transparent'}}>
            <thead>
              <tr style={{color:'#00b86b',fontWeight:700,background:'#f7faff'}}>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Name</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Location</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Description</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bases.map(b => (
                <tr key={b._id} style={{borderBottom:'1px solid #e0e7ef',background:bases.indexOf(b)%2===0?'#fff':'#f7faff'}}>
                  <td style={{padding:'0.85rem 1.2rem'}}>{b.name}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{b.location}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{b.description}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>
                    <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                      <button style={{background:'#3e5ba9',color:'#fff'}} onClick={() => handleEdit(b)}>Edit</button>
                      <button style={{background:'#ff4d4f',color:'#fff'}} onClick={() => handleDelete(b._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h3>{editBase ? 'Edit Base' : 'Add Base'}</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => { setShowModal(false); setEditBase(null); setForm({ name: '', location: '', description: '' }); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 