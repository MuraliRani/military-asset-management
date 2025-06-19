import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({ username: '', email: '', reason: '' });
  const [requestStatus, setRequestStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRequestChange = e => setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
  const handleRequestSubmit = e => {
    e.preventDefault();
    setRequestStatus('Request submitted! (Demo: not actually sent)');
    setRequestForm({ username: '', email: '', reason: '' });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} style={{ marginBottom: '2.2rem' }}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="info-section">
        <div style={{fontSize:'1.08rem',marginBottom:'0.7rem',color:'#232946',fontWeight:600}}>
          <b>Default Admin:</b> <span style={{fontWeight:400}}>Username: <code>admin</code> Password: <code>admin123</code></span>
        </div>
        <div className="info-buttons">
          <button type="button" onClick={()=>setShowHelp(true)}>How to Login?</button>
        </div>
      </div>
      {showHelp && (
        <div className="modal" onClick={()=>setShowHelp(false)}>
          <form style={{pointerEvents:'auto'}} onClick={e=>e.stopPropagation()}>
            <h3>How to Login?</h3>
            <ul style={{textAlign:'left'}}>
              <li>Use the default admin credentials above for first login.</li>
              <li>Admins can add new users from the Users page after login.</li>
            </ul>
            <button type="button" onClick={()=>setShowHelp(false)}>Close</button>
          </form>
        </div>
      )}
    </div>
  );
} 