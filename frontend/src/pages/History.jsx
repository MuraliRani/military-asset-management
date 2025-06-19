import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function History() {
  const { token, user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      let data = [];
      if (user.role === 'admin') {
        const res = await fetch(`/api/logs?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        data = json.logs || [];
        setTotal(json.total || 0);
      } else {
        const res = await fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        data = [
          ...(json.purchases || []).map(l => ({ ...l, action: 'purchase_create', user: l.purchasedBy })),
          ...(json.transfers || []).map(l => ({ ...l, action: 'transfer_create', user: l.transferredBy })),
          ...(json.assignments || []).map(l => ({ ...l, action: 'assignment_create', user: l.assignedBy })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, [token, user, page]);

  return (
    <div style={{maxWidth:900,margin:'2.5rem auto 0 auto',padding:'0 1rem'}}>
      <h2 style={{fontWeight:700,marginBottom:'1.5rem',color:'#232946',textAlign:'left'}}>History Logs</h2>
      {loading ? <div>Loading...</div> : (
        <div style={{overflowX:'auto',marginBottom:'2.5rem'}}>
          <table style={{width:'100%',borderCollapse:'collapse',color:'#232946',fontSize:'1.05rem',background:'transparent'}}>
            <thead>
              <tr style={{color:'#00b86b',fontWeight:700,background:'#f7faff'}}>
                <th style={{padding:'1rem 1.2rem',textAlign:'center'}}>Action</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>User</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Date</th>
                <th style={{padding:'1rem 1.2rem',textAlign:'left'}}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log._id || i} style={{borderBottom:'1px solid #e0e7ef',background:i%2===0?'#fff':'#f7faff'}}>
                  <td style={{padding:'0.85rem 1.2rem',textAlign:'center'}}>{log.action}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{log.user?.username || log.user?.id || ''}</td>
                  <td style={{padding:'0.85rem 1.2rem'}}>{log.date && new Date(log.date).toLocaleString()}</td>
                  <td style={{padding:'0.85rem 1.2rem',maxWidth:'420px',whiteSpace:'pre-wrap',wordBreak:'break-word',fontSize:'0.98em'}}>
                    {(() => {
                      const d = log.details || log.asset || {};
                      return (
                        <>
                          <b>Quantity:</b> {d.assignment?.quantity || d.transfer?.quantity || d.purchase?.quantity || d.quantity || '-'}<br/>
                          <b>Assigned To:</b> {d.assignment?.assignedTo || d.assignedTo || '-'}
                        </>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {user.role === 'admin' && total > limit && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <span>Page {page}</span>
              <button disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 