import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Target, CheckSquare, LogOut, FileText, Users, Activity } from 'lucide-react';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) {
    return children; // Login screen doesn't need layout
  }

  const getMenuItems = () => {
    const role = currentUser.role;
    if (role === 'Employee') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'My Goals', icon: Target, path: '/employee/goals' },
        { label: 'Quarterly Check-in', icon: CheckSquare, path: '/employee/checkin' }
      ];
    } else if (role === 'Manager') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Team Approvals', icon: FileText, path: '/manager/approvals' },
        { label: 'Team Check-ins', icon: CheckSquare, path: '/manager/checkins' }
      ];
    } else if (role === 'Admin') {
      return [
        { label: 'Dashboard', icon: Activity, path: '/' },
        { label: 'Shared Goals', icon: Target, path: '/admin/shared-goals' },
        { label: 'Audit Trail', icon: FileText, path: '/admin/audit' }
      ];
    }
    return [];
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '1.5rem', margin: 0 }}>
            <Activity size={28} /> ATOMQUEST
          </h2>
          <span className="badge badge-info mt-4">{currentUser.role} Portal</span>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {getMenuItems().map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.15), transparent)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: isActive ? '500' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={20} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--accent-primary), var(--info))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{currentUser.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{currentUser.department}</div>
            </div>
          </div>
          <button 
            className="btn btn-secondary w-full justify-center"
            onClick={handleLogout}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{
          height: '70px',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Topbar content like Notifications could go here */}
          <div className="flex items-center gap-4">
             <span className="text-sm text-muted">System Cycle: Phase 1 (May)</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
