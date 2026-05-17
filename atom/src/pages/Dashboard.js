import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { goals, users, checkins } = useData();

  const renderEmployeeDashboard = () => {
    const myGoals = goals.filter(g => g.employeeId === currentUser.id);
    const approved = myGoals.filter(g => g.status === 'Approved').length;
    const pending = myGoals.filter(g => g.status === 'Pending').length;
    const draft = myGoals.filter(g => g.status === 'Draft').length;

    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Approved Goals</h3>
          <div className="text-3xl font-bold text-success">{approved}</div>
        </div>
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Pending Approval</h3>
          <div className="text-3xl font-bold text-warning">{pending}</div>
        </div>
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Drafts</h3>
          <div className="text-3xl font-bold text-info">{draft}</div>
        </div>
      </div>
    );
  };

  const renderManagerDashboard = () => {
    const teamMembers = users.filter(u => u.managerId === currentUser.id);
    const teamIds = teamMembers.map(u => u.id);
    const teamGoals = goals.filter(g => teamIds.includes(g.employeeId));
    const pendingApprovals = teamGoals.filter(g => g.status === 'Pending').length;

    return (
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Team Members</h3>
          <div className="text-3xl font-bold text-info">{teamMembers.length}</div>
        </div>
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Goals Pending Approval</h3>
          <div className="text-3xl font-bold text-warning">{pendingApprovals}</div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    return (
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Total Employees</h3>
          <div className="text-3xl font-bold">{users.filter(u => u.role === 'Employee').length}</div>
        </div>
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Total Goals Tracked</h3>
          <div className="text-3xl font-bold">{goals.length}</div>
        </div>
        <div className="glass-panel">
          <h3 className="text-sm text-muted mb-2">Check-ins Logged</h3>
          <div className="text-3xl font-bold text-success">{checkins.length}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <h1 className="mb-2">Welcome, {currentUser.name}</h1>
      <p className="mb-6 text-muted">Here is your {currentUser.role.toLowerCase()} overview.</p>
      
      {currentUser.role === 'Employee' && renderEmployeeDashboard()}
      {currentUser.role === 'Manager' && renderManagerDashboard()}
      {currentUser.role === 'Admin' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;
