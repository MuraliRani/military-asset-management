import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Purchases() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token, user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ asset: '', quantity: '', base: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [editPurchase, setEditPurchase] = useState(null);

  useEffect(() => {
    async function fetchPurchases() {
      setLoading(true);
      const res = await fetch(`${apiUrl}/purchases`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setPurchases(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchPurchases();
  }, [token, status]);

  const canAdd = user && (user.role === 'admin' || user.role === 'logistics_officer');

  const handleEdit = (purchase) => {
    setEditPurchase(purchase);
    setForm({
      asset: purchase.asset?._id || purchase.asset,
      quantity: purchase.quantity,
      base: purchase.base?._id || purchase.base
    });
    setShowModal(true);
    // Fetch assets and bases for dropdowns
    fetchDropdowns();
  };

  const handleDelete = async (purchaseId) => {
    if (!window.confirm('Are you sure you want to delete this purchase?')) return;
    setStatus(''); setError('');
    try {
      const res = await fetch(`${apiUrl}/purchases/${purchaseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete purchase');
      setStatus('Purchase deleted!');
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
      if (editPurchase) {
        res = await fetch(`${apiUrl}/purchases/${editPurchase._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(`${apiUrl}/purchases`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to save purchase');
      setStatus(editPurchase ? 'Purchase updated!' : 'Purchase added!');
      setShowModal(false);
      setEditPurchase(null);
      setForm({ asset: '', quantity: '', base: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{maxWidth:900,margin:'2.5rem auto 0 auto',padding:'0 1rem'}}>
      <h2 style={{fontWeight:700,marginBottom:'1.5rem',color:'#232946',textAlign:'left'}}>Purchases</h2>
      {canAdd && <button className="add-btn" onClick={openModal}>Add Purchase</button>}
      {status && <div className="status">{status}</div>}
      {error && <div className="error">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div style={{
          background: '#fff',
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
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Asset</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Quantity</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Base</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Date</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>By</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p._id} style={{borderBottom:'1px solid #e0e7ef',background:purchases.indexOf(p)%2===0?'#fff':'#f7faff'}}>
                  <td style={{padding:'0.85rem 1.2rem'}}>{p.asset?.name}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>{p.quantity}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{p.base?.name}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{p.date && new Date(p.date).toLocaleString()}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{p.purchasedBy?.username}</td>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>
                    <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                      <button style={{background:'#3e5ba9',color:'#fff'}} onClick={() => handleEdit(p)}>Edit</button>
                      <button style={{background:'#ff4d4f',color:'#fff'}} onClick={() => handleDelete(p._id)}>Delete</button>
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
            <h3>{editPurchase ? 'Edit Purchase' : 'Add Purchase'}</h3>
            <select name="asset" value={form.asset} onChange={handleChange} required>
              <option value="">Select Asset</option>
              {assets.map(a => <option key={a._id} value={a._id}>{a.name} ({a.type})</option>)}
            </select>
            <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
            <select name="base" value={form.base} onChange={handleChange} required>
              <option value="">Select Base</option>
              {bases.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => { setShowModal(false); setEditPurchase(null); setForm({ asset: '', quantity: '', base: '' }); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 