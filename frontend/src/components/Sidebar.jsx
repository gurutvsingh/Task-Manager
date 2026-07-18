import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  // Get initials for user avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <CheckSquare size={24} />
        </div>
        <span className="sidebar-title">TaskFlow</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          <li>
            <button
              className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
              style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item ${activeView === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveView('tasks')}
              style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}
            >
              <ClipboardList size={18} />
              <span>My Tasks</span>
            </button>
          </li>
        </ul>
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {getInitials(user.name)}
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
