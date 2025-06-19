import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav>
      <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Military Asset Management System</div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/purchases">Purchases</Link>
        <Link to="/transfers">Transfers</Link>
        <Link to="/assignments">Assignments</Link>
        <Link to="/history">History</Link>
        {user.role === 'admin' && <Link to="/bases">Bases</Link>}
        {user.role === 'admin' && <Link to="/assets">Assets</Link>}
        {user.role === 'admin' && <Link to="/users">Users</Link>}
        <button className="logout-btn" style={{background:'#ff4d4f',color:'#fff',padding:'0.45rem 1.2rem',borderRadius:'4px',border:'none',fontWeight:700,cursor:'pointer'}} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
} 