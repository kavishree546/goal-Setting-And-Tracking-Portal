import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Plus, Send, AlertCircle, Lock } from 'lucide-react';

const EmployeeGoals = () => {
  const { currentUser } = useAuth();
  const { goals, addGoal, submitGoalsForApproval } = useData();
  
  const myGoals = goals.filter(g => g.employeeId === currentUser.id);
  const totalWeight = myGoals.reduce((sum, g) => sum + Number(g.weightage), 0);
  const canSubmit = myGoals.length > 0 && totalWeight === 100 && myGoals.some(g => g.status === 'Draft' || g.status === 'Rework');
  const isLocked = myGoals.some(g => g.status === 'Pending' || g.status === 'Approved');

  const [formData, setFormData] = useState({
    thrustArea: '',
    title: '',
    description: '',
    uom: 'Numeric',
    target: '',
    weightage: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (myGoals.length >= 8) {
      setError('Maximum 8 goals allowed.');
      return;
    }
    const weight = Number(formData.weightage);
    if (weight < 10) {
      setError('Minimum weightage per goal is 10%.');
      return;
    }
    if (totalWeight + weight > 100) {
      setError(`Adding this goal exceeds 100% weightage. Current: ${totalWeight}%, Added: ${weight}%`);
      return;
    }
    if (!formData.title || !formData.thrustArea || !formData.target) {
      setError('Please fill in all required fields.');
      return;
    }

    addGoal({
      ...formData,
      employeeId: currentUser.id,
      status: 'Draft',
    });
    
    setFormData({ thrustArea: '', title: '', description: '', uom: 'Numeric', target: '', weightage: '' });
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>My Goals</h1>
          <p className="text-muted">Phase 1: Goal Setting</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`badge ${totalWeight === 100 ? 'badge-success' : 'badge-warning'}`}>
            Total Weightage: {totalWeight}%
          </div>
          {!isLocked && (
            <button 
              className="btn btn-primary" 
              disabled={!canSubmit}
              onClick={() => submitGoalsForApproval(currentUser.id)}
            >
              <Send size={16} /> Submit for Approval
            </button>
          )}
        </div>
      </div>

      {isLocked && (
        <div className="glass-panel mb-6" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
          <div className="flex items-center gap-2 text-info mb-2">
            <Lock size={18} /> <span className="font-bold">Goals Locked</span>
          </div>
          <p className="text-sm">Your goals have been submitted for approval or are already approved. You cannot add or edit goals at this time.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Goal Form */}
        <div className="glass-panel col-span-1 h-fit" style={{ opacity: isLocked ? 0.5 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
          <h2 className="text-xl mb-4">Create Goal</h2>
          {error && (
            <div className="bg-danger text-white p-3 rounded-md mb-4 flex items-start gap-2 text-sm" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
              <AlertCircle size={16} className="mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleAddGoal}>
            <div className="form-group">
              <label className="form-label">Thrust Area</label>
              <select className="form-select" name="thrustArea" value={formData.thrustArea} onChange={handleInputChange}>
                <option value="">Select Area...</option>
                <option value="Financial">Financial</option>
                <option value="Customer">Customer</option>
                <option value="Process">Process</option>
                <option value="Learning">Learning & Growth</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Goal Title</label>
              <input type="text" className="form-input" name="title" value={formData.title} onChange={handleInputChange} placeholder="E.g., Increase Q1 Sales" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">UoM</label>
                <select className="form-select" name="uom" value={formData.uom} onChange={handleInputChange}>
                  <option value="Numeric">Numeric (Min)</option>
                  <option value="NumericMax">Numeric (Max)</option>
                  <option value="%">%</option>
                  <option value="Timeline">Timeline</option>
                  <option value="Zero">Zero-based</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Weightage (%)</label>
                <input type="number" className="form-input" name="weightage" value={formData.weightage} onChange={handleInputChange} min="10" max="100" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Target</label>
              <input type="text" className="form-input" name="target" value={formData.target} onChange={handleInputChange} placeholder="E.g., 100000 or 2026-12-31" />
            </div>
            <button type="submit" className="btn btn-secondary w-full justify-center">
              <Plus size={16} /> Add Goal
            </button>
          </form>
        </div>

        {/* Goal List */}
        <div className="col-span-2 flex flex-col gap-4">
          {myGoals.length === 0 ? (
            <div className="glass-panel text-center p-8 text-muted">
              No goals created yet. Create a goal to get started.
            </div>
          ) : (
            myGoals.map(goal => (
              <div key={goal.id} className="glass-panel" style={{ borderLeft: `4px solid ${goal.status === 'Approved' ? 'var(--success)' : goal.status === 'Rework' ? 'var(--danger)' : 'var(--warning)'}` }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-accent-primary font-bold uppercase tracking-wider">{goal.thrustArea}</span>
                    <h3 className="text-lg">{goal.title}</h3>
                  </div>
                  <span className={`badge ${goal.status === 'Approved' ? 'badge-success' : goal.status === 'Rework' ? 'badge-danger' : 'badge-warning'}`}>
                    {goal.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 p-3 rounded-md" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div>
                    <div className="text-xs text-muted mb-1">Target ({goal.uom})</div>
                    <div className="font-medium">{goal.target}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1">Weightage</div>
                    <div className="font-medium">{goal.weightage}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1">Type</div>
                    <div className="font-medium">{goal.isShared ? 'Shared KPI' : 'Individual'}</div>
                  </div>
                </div>
                {goal.managerComment && (
                  <div className="mt-4 p-3 rounded-md text-sm border border-danger text-danger" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <strong>Manager Comment:</strong> {goal.managerComment}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeGoals;
