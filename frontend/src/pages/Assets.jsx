import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Assets() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', quantity: '', base: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [editAsset, setEditAsset] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    async function fetchAssets() {
      setLoading(true);
      const [assetsRes, basesRes] = await Promise.all([
        fetch(`${apiUrl}/assets`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/bases`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAssets(await assetsRes.json());
      setBases(await basesRes.json());
      setLoading(false);
    }
    fetchAssets();
  }, [token, user, status]);

  if (user?.role !== 'admin') return <div>Access denied.</div>;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (asset) => {
    setEditAsset(asset);
    setForm({ name: asset.name, type: asset.type, quantity: asset.quantity, base: asset.base?._id || asset.base });
    setShowModal(true);
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    setStatus(''); setError('');
    try {
      const res = await fetch(`${apiUrl}/assets/${assetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete asset');
      setStatus('Asset deleted!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(''); setError('');
    try {
      let res;
      if (editAsset) {
        res = await fetch(`${apiUrl}/assets/${editAsset._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`${apiUrl}/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to save asset');
      setStatus(editAsset ? 'Asset updated!' : 'Asset added!');
      setShowModal(false);
      setEditAsset(null);
      setForm({ name: '', type: '', quantity: '', base: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{maxWidth:900,margin:'2.5rem auto 0 auto',padding:'0 1rem'}}>
      <h2 style={{fontWeight:700,marginBottom:'1.5rem',color:'#232946',textAlign:'left'}}>Assets</h2>
      <button className="add-btn" onClick={() => setShowModal(true)}>Add Asset</button>
      {status && <div className="status">{status}</div>}
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div style={{
          background: 'linear-gradient(135deg, #f7faff 60%, #e0e7ef 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(35,41,70,0.10)',
          padding: '0.5rem 0',
          width: '100%',
          minHeight: '110px',
          marginBottom: '2.5rem',
          overflowX: 'auto',
          display: 'block'
        }}>
          <table style={{width:'100%',borderCollapse:'collapse',color:'#232946',fontSize:'1.05rem',background:'transparent'}}>
            <thead>
              <tr style={{color:'#00b86b',fontWeight:700,background:'#f7faff'}}>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Name</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Type</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Quantity</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Base</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a._id} style={{borderBottom:'1px solid #e0e7ef',background:assets.indexOf(a)%2===0?'#fff':'#f7faff'}}>
                  <td style={{padding:'0.85rem 1.2rem'}}>{a.name}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{a.type}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>{a.quantity}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{a.base?.name}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>
                    <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                      <button style={{background:'#3e5ba9',color:'#fff',padding:'0.5rem 1.2rem',fontSize:'1rem',borderRadius:'6px',border:'none',fontWeight:600,cursor:'pointer'}} onClick={() => handleEdit(a)}>Edit</button>
                      <button style={{background:'#ff4d4f',color:'#fff',padding:'0.5rem 1.2rem',fontSize:'1rem',borderRadius:'6px',border:'none',fontWeight:600,cursor:'pointer'}} onClick={() => handleDelete(a._id)}>Delete</button>
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
            <h3>{editAsset ? 'Edit Asset' : 'Add Asset'}</h3>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="type" placeholder="Type (e.g. vehicle, weapon)" value={form.type} onChange={handleChange} required />
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
            <select name="base" value={form.base} onChange={handleChange} required>
              <option value="">Select Base</option>
              {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => { setShowModal(false); setEditAsset(null); setForm({ name: '', type: '', quantity: '', base: '' }); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 