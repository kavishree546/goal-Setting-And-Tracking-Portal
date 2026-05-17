import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Download, Search } from 'lucide-react';

const AdminAudit = () => {
  const { users, goals, checkins } = useData();
  const [activeTab, setActiveTab] = useState('completion');

  const employees = users.filter(u => u.role === 'Employee');

  const getCompletionData = () => {
    return employees.map(emp => {
      const empGoals = goals.filter(g => g.employeeId === emp.id);
      const isGoalSettingComplete = empGoals.length > 0 && empGoals.some(g => g.status === 'Approved');
      
      const empCheckins = checkins.filter(c => c.employeeId === emp.id);
      const isQ1Complete = empCheckins.length > 0; // Simplified for demo
      
      return {
        ...emp,
        goalsSet: empGoals.length,
        goalStatus: isGoalSettingComplete ? 'Complete' : (empGoals.length > 0 ? 'Pending Approval' : 'Not Started'),
        q1Checkin: isQ1Complete ? 'Complete' : 'Pending'
      };
    });
  };

  const exportCSV = () => {
    const data = getCompletionData();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Department,Manager,Goal Status,Q1 Check-in\n"
      + data.map(d => `${d.name},${d.department},${users.find(u=>u.id===d.managerId)?.name},${d.goalStatus},${d.q1Checkin}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "completion_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Reporting & Audit</h1>
          <p className="text-muted">Completion dashboards and system audit logs</p>
        </div>
        <button className="btn btn-secondary" onClick={exportCSV}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          className={`btn ${activeTab === 'completion' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('completion')}
        >
          Completion Dashboard
        </button>
        <button 
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Trail
        </button>
      </div>

      {activeTab === 'completion' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Manager</th>
                <th>Phase 1 (Goal Setting)</th>
                <th>Phase 2 (Q1 Check-in)</th>
              </tr>
            </thead>
            <tbody>
              {getCompletionData().map(row => (
                <tr key={row.id}>
                  <td className="font-medium">{row.name}</td>
                  <td>{row.department}</td>
                  <td>{users.find(u=>u.id===row.managerId)?.name}</td>
                  <td>
                    <span className={`badge ${row.goalStatus === 'Complete' ? 'badge-success' : row.goalStatus === 'Pending Approval' ? 'badge-warning' : 'badge-danger'}`}>
                      {row.goalStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${row.q1Checkin === 'Complete' ? 'badge-success' : 'badge-warning'}`}>
                      {row.q1Checkin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="glass-panel text-center p-8">
          <Search size={48} className="mx-auto text-muted mb-4" />
          <h3 className="text-xl mb-2">Audit Logs</h3>
          <p className="text-muted max-w-md mx-auto">
            Audit logs tracking changes to locked goals (Weightage updates, Target adjustments post-approval) are tracked here.
            <br/><br/>
            <em>In a real implementation, this would query the backend audit log table.</em>
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
