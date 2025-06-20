import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const metricIcons = {
  assets: '📦',
  purchases: '🛒',
  transfers: '🔄',
  assignments: '🎯',
};

export default function Dashboard() {
  const { token, user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [metrics, setMetrics] = useState({ assets: 0, purchases: 0, transfers: 0, assignments: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const [assets, purchases, transfers, assignments, history] = await Promise.all([
        fetch(`${apiUrl}/assets`, { headers }),
        fetch(`${apiUrl}/purchases`, { headers }),
        fetch(`${apiUrl}/transfers`, { headers }),
        fetch(`${apiUrl}/assignments`, { headers }),
        fetch(`${apiUrl}/history`, { headers })
      ]);
      const [assetsData, purchasesData, transfersData, assignmentsData, historyData] = await Promise.all([
        assets.json(), purchases.json(), transfers.json(), assignments.json(), history.json()
      ]);
      setMetrics({
        assets: assetsData.length,
        purchases: purchasesData.length,
        transfers: transfersData.length,
        assignments: assignmentsData.length
      });
      // Show last 5 from all history types
      const logs = [
        ...(historyData.purchases || []).map(l => ({ ...l, action: 'Purchase' })),
        ...(historyData.transfers || []).map(l => ({ ...l, action: 'Transfer' })),
        ...(historyData.assignments || []).map(l => ({ ...l, action: 'Assignment' })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      setRecent(logs);
      setLoading(false);
    }
    fetchData();
  }, [token]);

  if (loading) return <div style={{padding:'2rem',textAlign:'center'}}>Loading dashboard...</div>;

  return (
    <div style={{maxWidth:900,margin:'2.5rem auto 0 auto',padding:'0 1rem'}}>
      <h2 style={{fontWeight:700,marginBottom:'1.5rem',color:'#232946',textAlign:'left'}}>Dashboard</h2>
      <div style={{display:'flex',gap:'1.5rem',marginBottom:'2.5rem',flexWrap:'wrap',justifyContent:'flex-start'}}>
        <div style={{background:'#fff',border:'1.5px solid #00ff7f',borderRadius:'12px',padding:'1.2rem 2rem',minWidth:'160px',textAlign:'center',fontWeight:600,color:'#232946',boxShadow:'0 2px 8px rgba(0,255,127,0.07)'}}>Assets<br/><span style={{fontSize:'2rem',fontWeight:700}}>{metrics.assets}</span></div>
        <div style={{background:'#fff',border:'1.5px solid #faae2b',borderRadius:'12px',padding:'1.2rem 2rem',minWidth:'160px',textAlign:'center',fontWeight:600,color:'#232946',boxShadow:'0 2px 8px rgba(250,174,43,0.07)'}}>Purchases<br/><span style={{fontSize:'2rem',fontWeight:700}}>{metrics.purchases}</span></div>
        <div style={{background:'#fff',border:'1.5px solid #16cfcf',borderRadius:'12px',padding:'1.2rem 2rem',minWidth:'160px',textAlign:'center',fontWeight:600,color:'#232946',boxShadow:'0 2px 8px rgba(22,207,207,0.07)'}}>Transfers<br/><span style={{fontSize:'2rem',fontWeight:700}}>{metrics.transfers}</span></div>
        <div style={{background:'#fff',border:'1.5px solid #ff4d4f',borderRadius:'12px',padding:'1.2rem 2rem',minWidth:'160px',textAlign:'center',fontWeight:600,color:'#232946',boxShadow:'0 2px 8px rgba(255,77,79,0.07)'}}>Assignments<br/><span style={{fontSize:'2rem',fontWeight:700}}>{metrics.assignments}</span></div>
      </div>
      <h3 style={{color:'#232946',marginBottom:'1rem',fontWeight:700}}>Recent Activity</h3>
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
              <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Action</th>
              <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Asset</th>
              <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Quantity</th>
              <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center',color:'#00b86b',background:'#f7faff'}}>No recent activity.</td></tr>
            ) : recent.map((log, i) => (
              <tr key={log._id || i} style={{borderBottom:'1px solid #e0e7ef',background:i%2===0?'#fff':'#f7faff'}}>
                <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>{log.action}</td>
                <td style={{padding:'0.85rem 1.2rem'}}>{log.asset ? log.asset.name : ''}</td>
                <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>{log.quantity ? `x${log.quantity}` : ''}</td>
                <td style={{padding:'0.85rem 1.2rem'}}>{log.date && new Date(log.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 