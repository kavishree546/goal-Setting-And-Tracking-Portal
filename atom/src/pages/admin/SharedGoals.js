import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Target, Send } from 'lucide-react';

const AdminSharedGoals = () => {
  const { users, pushSharedGoal } = useData();
  const employees = users.filter(u => u.role === 'Employee');
  
  const [formData, setFormData] = useState({
    thrustArea: '',
    title: '',
    description: '',
    uom: 'Numeric',
    target: '',
    weightage: '10' // default weightage, employees can adjust
  });
  
  const [selectedDepts, setSelectedDepts] = useState([]);

  const departments = [...new Set(employees.map(e => e.department))];

  const handleDeptToggle = (dept) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(selectedDepts.filter(d => d !== dept));
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handlePushGoal = (e) => {
    e.preventDefault();
    if (selectedDepts.length === 0) {
      alert("Please select at least one department.");
      return;
    }

    const targetEmployees = employees.filter(e => selectedDepts.includes(e.department)).map(e => e.id);
    
    pushSharedGoal(formData, targetEmployees);
    alert(`Shared goal pushed successfully to ${targetEmployees.length} employees!`);
    
    setFormData({ thrustArea: '', title: '', description: '', uom: 'Numeric', target: '', weightage: '10' });
    setSelectedDepts([]);
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Shared Goals</h1>
          <p className="text-muted">Push Departmental KPIs to multiple employees</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel">
          <h2 className="text-xl mb-4 flex items-center gap-2"><Target size={20}/> Configure KPI</h2>
          <form onSubmit={handlePushGoal}>
            <div className="form-group">
              <label className="form-label">Thrust Area</label>
              <select className="form-select" value={formData.thrustArea} onChange={e => setFormData({...formData, thrustArea: e.target.value})} required>
                <option value="">Select Area...</option>
                <option value="Financial">Financial</option>
                <option value="Customer">Customer</option>
                <option value="Process">Process</option>
                <option value="Learning">Learning & Growth</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Goal Title (Read-only for employees)</label>
              <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">UoM</label>
                <select className="form-select" value={formData.uom} onChange={e => setFormData({...formData, uom: e.target.value})}>
                  <option value="Numeric">Numeric (Min)</option>
                  <option value="NumericMax">Numeric (Max)</option>
                  <option value="%">%</option>
                  <option value="Timeline">Timeline</option>
                  <option value="Zero">Zero-based</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target (Read-only)</label>
                <input type="text" className="form-input" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Target Departments</label>
              <div className="flex gap-2 flex-wrap mb-4">
                {departments.map(dept => (
                  <button 
                    key={dept} 
                    type="button"
                    onClick={() => handleDeptToggle(dept)}
                    className={`badge cursor-pointer ${selectedDepts.includes(dept) ? 'badge-primary' : 'badge-neutral'}`}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      background: selectedDepts.includes(dept) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                      color: selectedDepts.includes(dept) ? 'white' : 'var(--text-secondary)'
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center">
              <Send size={16} /> Push to Selected Departments
            </button>
          </form>
        </div>
        
        <div>
          <div className="glass-panel" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <h3 className="text-info mb-2">How Shared Goals Work</h3>
            <ul className="text-sm space-y-2 text-muted" style={{ listStylePosition: 'inside' }}>
              <li>Shared goals are automatically approved and locked upon distribution.</li>
              <li>Employees cannot change the Title or Target.</li>
              <li>Employees CAN adjust the Weightage to balance their 100% total limit.</li>
              <li>Updates to actual achievements are tracked individually by each employee during quarterly check-ins.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSharedGoals;
