import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Save } from 'lucide-react';

const EmployeeCheckin = () => {
  const { currentUser } = useAuth();
  const { goals, checkins, addCheckin } = useData();
  
  // Only show approved goals
  const myGoals = goals.filter(g => g.employeeId === currentUser.id && g.status === 'Approved');
  
  const [actuals, setActuals] = useState({});
  const [statuses, setStatuses] = useState({});

  const handleActualChange = (id, value) => setActuals({ ...actuals, [id]: value });
  const handleStatusChange = (id, value) => setStatuses({ ...statuses, [id]: value });

  const calculateScore = (uom, target, actual) => {
    if (!actual || !target) return 0;
    let score = 0;
    try {
      if (uom === 'Numeric' || uom === '%') {
        // Min (Higher is better)
        score = (Number(actual) / Number(target)) * 100;
      } else if (uom === 'NumericMax') {
        // Max (Lower is better)
        score = (Number(target) / Number(actual)) * 100;
      } else if (uom === 'Zero') {
        score = Number(actual) === 0 ? 100 : 0;
      } else if (uom === 'Timeline') {
        const targetDate = new Date(target).getTime();
        const actualDate = new Date(actual).getTime();
        score = actualDate <= targetDate ? 100 : 0; // Simplified
      }
    } catch (e) {
      score = 0;
    }
    return Math.min(Math.max(score, 0), 100).toFixed(1);
  };

  const handleSaveCheckin = (goal) => {
    const actual = actuals[goal.id];
    const status = statuses[goal.id] || 'On Track';
    const score = calculateScore(goal.uom, goal.target, actual);
    
    addCheckin({
      goalId: goal.id,
      employeeId: currentUser.id,
      quarter: 'Q1', // Hardcoded for demo, normally based on system date
      actual,
      status,
      score
    });
    
    alert('Check-in saved successfully!');
  };

  if (myGoals.length === 0) {
    return (
      <div className="page-container">
        <h1>Quarterly Check-in</h1>
        <div className="glass-panel text-center p-8 mt-6">
          <p className="text-muted">You do not have any approved goals to check in against.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Quarterly Check-in</h1>
          <p className="text-muted">Phase 2: Log actual achievement against targets</p>
        </div>
        <div className="badge badge-info">Current Window: Q1 Check-in</div>
      </div>

      <div className="flex flex-col gap-6">
        {myGoals.map(goal => {
          // Find latest checkin for this goal
          const goalCheckins = checkins.filter(c => c.goalId === goal.id);
          const latestCheckin = goalCheckins[goalCheckins.length - 1];
          const currentActual = actuals[goal.id] !== undefined ? actuals[goal.id] : (latestCheckin?.actual || '');
          const currentStatus = statuses[goal.id] !== undefined ? statuses[goal.id] : (latestCheckin?.status || 'On Track');
          const currentScore = calculateScore(goal.uom, goal.target, currentActual);

          return (
            <div key={goal.id} className="glass-panel">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg">{goal.title}</h3>
                  <p className="text-sm text-muted">{goal.thrustArea} | Weight: {goal.weightage}%</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted mb-1">Progress Score</div>
                  <div className={`text-2xl font-bold ${currentScore >= 100 ? 'text-success' : currentScore > 50 ? 'text-info' : 'text-warning'}`}>
                    {currentScore}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 items-end bg-black bg-opacity-20 p-4 rounded-md">
                <div>
                  <label className="text-xs text-muted block mb-1">Target ({goal.uom})</label>
                  <div className="font-medium p-2 bg-black bg-opacity-20 rounded border border-white border-opacity-5">
                    {goal.target}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Actual Achievement</label>
                  <input 
                    type={goal.uom === 'Timeline' ? 'date' : 'text'} 
                    className="form-input" 
                    value={currentActual}
                    onChange={(e) => handleActualChange(goal.id, e.target.value)}
                    placeholder="Enter actual..."
                  />
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Status</label>
                  <select 
                    className="form-select"
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(goal.id, e.target.value)}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="On Track">On Track</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <button 
                    className="btn btn-primary w-full"
                    onClick={() => handleSaveCheckin(goal)}
                    disabled={!currentActual}
                  >
                    <Save size={16} /> Save Update
                  </button>
                </div>
              </div>

              {latestCheckin?.managerComment && (
                <div className="mt-4 p-3 rounded-md text-sm border border-info bg-info bg-opacity-10 text-info">
                  <strong>Manager Feedback ({latestCheckin.quarter}):</strong> {latestCheckin.managerComment}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeCheckin;
