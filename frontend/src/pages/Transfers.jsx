import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Transfers() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ asset: '', quantity: '', fromBase: '', toBase: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [editTransfer, setEditTransfer] = useState(null);

  useEffect(() => {
    async function fetchTransfers() {
      setLoading(true);
      const res = await fetch(`${apiUrl}/transfers`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTransfers(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchTransfers();
  }, [token, status]);

  const canAdd = user && (user.role === 'admin' || user.role === 'logistics_officer');

  const handleEdit = (transfer) => {
    setEditTransfer(transfer);
    setForm({
      asset: transfer.asset?._id || transfer.asset,
      quantity: transfer.quantity,
      fromBase: transfer.fromBase?._id || transfer.fromBase,
      toBase: transfer.toBase?._id || transfer.toBase
    });
    setShowModal(true);
    fetchDropdowns();
  };

  const handleDelete = async (transferId) => {
    if (!window.confirm('Are you sure you want to delete this transfer?')) return;
    setStatus(''); setError('');
    try {
      const res = await fetch(`${apiUrl}/transfers/${transferId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete transfer');
      setStatus('Transfer deleted!');
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchDropdowns = async () => {
    const [assetsRes, basesRes] = await Promise.all([
      fetch(`${apiUrl}/assets`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiUrl}/bases`, { headers: { Authorization: `Bearer ${token}` } })
    ]);
    setAssets(await assetsRes.json());
    setBases(await basesRes.json());
  };

  const openModal = async () => {
    setShowModal(true);
    await fetchDropdowns();
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(''); setError('');
    try {
      let res;
      if (editTransfer) {
        res = await fetch(`${apiUrl}/transfers/${editTransfer._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`${apiUrl}/transfers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to save transfer');
      setStatus(editTransfer ? 'Transfer updated!' : 'Transfer added!');
      setShowModal(false);
      setEditTransfer(null);
      setForm({ asset: '', quantity: '', fromBase: '', toBase: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{maxWidth:900,margin:'2.5rem auto 0 auto',padding:'0 1rem'}}>
      <h2 style={{fontWeight:700,marginBottom:'1.5rem',color:'#232946',textAlign:'left'}}>Transfers</h2>
      {canAdd && <button className="add-btn" onClick={openModal}>Add Transfer</button>}
      {status && <div className="status">{status}</div>}
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div style={{overflowX:'auto',marginBottom:'2.5rem'}}>
          <table style={{width:'100%',borderCollapse:'collapse',color:'#232946',fontSize:'1.05rem',background:'#fff'}}>
            <thead>
              <tr style={{color:'#00b86b',fontWeight:700,background:'#f7faff'}}>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Asset</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Quantity</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>From Base</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>To Base</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Date</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>By</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t._id} style={{borderBottom:'1px solid #e0e7ef',background:transfers.indexOf(t)%2===0?'#fff':'#f7faff'}}>
                  <td style={{padding:'0.85rem 1.2rem'}}>{t.asset?.name}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>{t.quantity}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{t.fromBase?.name}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{t.toBase?.name}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{t.date && new Date(t.date).toLocaleString()}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{t.transferredBy?.username}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>
                    <div style={{display:'flex',gap:'0.5rem',justifyContent:'center',flexDirection:'row',alignItems:'center',width:'100%'}}>
                      <button style={{background:'#3e5ba9',color:'#fff',padding:'0.5rem 1.2rem',fontSize:'1rem',borderRadius:'6px',border:'none',fontWeight:600,cursor:'pointer',minWidth:'80px'}} onClick={() => handleEdit(t)}>Edit</button>
                      <button style={{background:'#ff4d4f',color:'#fff',padding:'0.5rem 1.2rem',fontSize:'1rem',borderRadius:'6px',border:'none',fontWeight:600,cursor:'pointer',minWidth:'80px'}} onClick={() => handleDelete(t._id)}>Delete</button>
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
            <h3>{editTransfer ? 'Edit Transfer' : 'Add Transfer'}</h3>
            <select name="asset" value={form.asset} onChange={handleChange} required>
              <option value="">Select Asset</option>
              {assets.map(a => <option key={a._id} value={a._id}>{a.name} ({a.type})</option>)}
            </select>
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
            <select name="fromBase" value={form.fromBase} onChange={handleChange} required>
              <option value="">From Base</option>
              {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <select name="toBase" value={form.toBase} onChange={handleChange} required>
              <option value="">To Base</option>
              {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => { setShowModal(false); setEditTransfer(null); setForm({ asset: '', quantity: '', fromBase: '', toBase: '' }); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 