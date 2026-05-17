import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Check, X, Edit2, Save } from 'lucide-react';

const ManagerApprovals = () => {
  const { currentUser } = useAuth();
  const { goals, users, approveGoal, rejectGoal, updateGoal } = useData();
  
  const teamMembers = users.filter(u => u.managerId === currentUser.id);
  const teamIds = teamMembers.map(u => u.id);
  
  const pendingGoals = goals.filter(g => teamIds.includes(g.employeeId) && g.status === 'Pending');
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [rejectComment, setRejectComment] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  const handleEditClick = (goal) => {
    setEditingId(goal.id);
    setEditForm({ target: goal.target, weightage: goal.weightage });
  };

  const handleSaveEdit = (goalId) => {
    updateGoal(goalId, editForm);
    setEditingId(null);
  };

  const handleReject = (goalId) => {
    if (!rejectComment) {
      alert("Please enter a reason for returning the goal.");
      return;
    }
    rejectGoal(goalId, rejectComment);
    setRejectingId(null);
    setRejectComment('');
  };

  const getUserName = (id) => {
    return users.find(u => u.id === id)?.name || 'Unknown';
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Goal Approvals</h1>
          <p className="text-muted">Review and approve team goals</p>
        </div>
        <div className="badge badge-warning">{pendingGoals.length} Pending</div>
      </div>

      {pendingGoals.length === 0 ? (
        <div className="glass-panel text-center p-8 text-muted">
          No goals pending approval at this time.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pendingGoals.map(goal => (
            <div key={goal.id} className="glass-panel border-l-4" style={{ borderLeftColor: 'var(--warning)' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-accent-primary">{getUserName(goal.employeeId)}</span>
                    <span className="text-xs text-muted px-2 py-0.5 rounded-full bg-white bg-opacity-10">{goal.thrustArea}</span>
                  </div>
                  <h3 className="text-lg">{goal.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-success p-2" onClick={() => approveGoal(goal.id)} title="Approve">
                    <Check size={18} />
                  </button>
                  <button className="btn btn-danger p-2" onClick={() => setRejectingId(goal.id)} title="Return for Rework">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {rejectingId === goal.id ? (
                <div className="bg-danger bg-opacity-10 border border-danger p-4 rounded-md mb-4">
                  <label className="text-sm text-danger block mb-2">Reason for Rework:</label>
                  <input 
                    type="text" 
                    className="form-input mb-2" 
                    value={rejectComment} 
                    onChange={e => setRejectComment(e.target.value)} 
                    placeholder="Enter comment..." 
                  />
                  <div className="flex gap-2 justify-end">
                    <button className="btn btn-secondary text-sm" onClick={() => setRejectingId(null)}>Cancel</button>
                    <button className="btn btn-danger text-sm" onClick={() => handleReject(goal.id)}>Submit Rework</button>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-4 gap-4 items-center bg-black bg-opacity-20 p-4 rounded-md">
                <div>
                  <div className="text-xs text-muted mb-1">UoM</div>
                  <div className="font-medium">{goal.uom}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Target</div>
                  {editingId === goal.id ? (
                    <input 
                      type="text" 
                      className="form-input py-1 px-2 h-auto text-sm" 
                      value={editForm.target} 
                      onChange={e => setEditForm({...editForm, target: e.target.value})} 
                    />
                  ) : (
                    <div className="font-medium">{goal.target}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Weightage</div>
                  {editingId === goal.id ? (
                    <input 
                      type="number" 
                      className="form-input py-1 px-2 h-auto text-sm w-20" 
                      value={editForm.weightage} 
                      onChange={e => setEditForm({...editForm, weightage: e.target.value})} 
                    />
                  ) : (
                    <div className="font-medium">{goal.weightage}%</div>
                  )}
                </div>
                <div className="text-right">
                  {editingId === goal.id ? (
                    <button className="btn btn-primary text-sm p-1.5 px-3" onClick={() => handleSaveEdit(goal.id)}>
                      <Save size={14} /> Save
                    </button>
                  ) : (
                    <button className="btn btn-secondary text-sm p-1.5 px-3" onClick={() => handleEditClick(goal)}>
                      <Edit2 size={14} /> Edit Inline
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerApprovals;
