import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MessageSquare, Save } from 'lucide-react';

const ManagerCheckins = () => {
  const { currentUser } = useAuth();
  const { goals, users, checkins, addManagerComment } = useData();
  
  const teamMembers = users.filter(u => u.managerId === currentUser.id);
  const teamIds = teamMembers.map(u => u.id);
  
  // Get all checkins for team
  const teamCheckins = checkins.filter(c => teamIds.includes(c.employeeId));
  
  const [commentForm, setCommentForm] = useState({});

  const handleSaveComment = (checkinId) => {
    addManagerComment(checkinId, commentForm[checkinId]);
    alert("Feedback saved!");
  };

  const getUserName = (id) => users.find(u => u.id === id)?.name || 'Unknown';
  const getGoalDetails = (id) => goals.find(g => g.id === id) || {};

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Team Check-ins</h1>
          <p className="text-muted">Review quarterly progress and add feedback</p>
        </div>
      </div>

      {teamCheckins.length === 0 ? (
        <div className="glass-panel text-center p-8 text-muted">
          No check-ins logged by your team yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {teamCheckins.map(checkin => {
            const goal = getGoalDetails(checkin.goalId);
            return (
              <div key={checkin.id} className="glass-panel">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-accent-primary">{getUserName(checkin.employeeId)}</span>
                      <span className="text-xs text-muted px-2 py-0.5 rounded-full bg-white bg-opacity-10">{checkin.quarter} Check-in</span>
                    </div>
                    <h3 className="text-lg">{goal.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted mb-1">System Score</div>
                    <div className={`text-xl font-bold ${checkin.score >= 100 ? 'text-success' : checkin.score > 50 ? 'text-info' : 'text-warning'}`}>
                      {checkin.score}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-black bg-opacity-20 p-4 rounded-md mb-4">
                  <div>
                    <span className="text-xs text-muted block mb-1">Planned Target</span>
                    <span className="font-medium">{goal.target}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block mb-1">Actual Achievement</span>
                    <span className="font-medium">{checkin.actual}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted block mb-1">Employee Status</span>
                    <span className="badge badge-info">{checkin.status}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted mb-2 flex items-center gap-2">
                    <MessageSquare size={16} /> Manager Check-in Feedback
                  </label>
                  <div className="flex gap-2">
                    <textarea 
                      className="form-textarea h-20" 
                      placeholder="Add structured feedback here..."
                      value={commentForm[checkin.id] !== undefined ? commentForm[checkin.id] : (checkin.managerComment || '')}
                      onChange={(e) => setCommentForm({...commentForm, [checkin.id]: e.target.value})}
                    ></textarea>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSaveComment(checkin.id)}
                    >
                      <Save size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagerCheckins;
