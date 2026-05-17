import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Users, Activity } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();

  const handleLogin = (user) => {
    login(user);
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-6">
          <Activity size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>ATOMQUEST</h1>
          <p>Goal Setting & Tracking Portal</p>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <p className="text-sm text-muted mb-2 text-center">
            For demonstration purposes, click a role below to log in.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div style={{ marginBottom: '1rem' }}>
            <h3 className="text-sm text-muted mb-2">Employees</h3>
            <div className="grid grid-cols-2 gap-2">
              {users.filter(u => u.role === 'Employee').map(user => (
                <button 
                  key={user.id} 
                  className="btn btn-secondary w-full"
                  onClick={() => handleLogin(user)}
                >
                  <Users size={16} /> {user.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <h3 className="text-sm text-muted mb-2">Managers</h3>
            <div className="grid grid-cols-1 gap-2">
              {users.filter(u => u.role === 'Manager').map(user => (
                <button 
                  key={user.id} 
                  className="btn btn-primary w-full"
                  onClick={() => handleLogin(user)}
                >
                  <Users size={16} /> {user.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-muted mb-2">Administrators</h3>
            <div className="grid grid-cols-1 gap-2">
              {users.filter(u => u.role === 'Admin').map(user => (
                <button 
                  key={user.id} 
                  className="btn btn-secondary w-full"
                  style={{ border: '1px solid var(--info)', color: 'var(--info)' }}
                  onClick={() => handleLogin(user)}
                >
                  <Activity size={16} /> {user.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
