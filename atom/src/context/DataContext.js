import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

// Initial Mock Data
const initialUsers = [
  { id: 'emp1', name: 'John Doe', role: 'Employee', managerId: 'mgr1', department: 'Sales' },
  { id: 'emp2', name: 'Jane Smith', role: 'Employee', managerId: 'mgr1', department: 'Sales' },
  { id: 'mgr1', name: 'Michael Scott', role: 'Manager', department: 'Sales' },
  { id: 'admin1', name: 'David Wallace', role: 'Admin', department: 'HR' }
];

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [systemDate, setSystemDate] = useState(new Date().toISOString());

  // Load from local storage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('atom_users');
    const storedGoals = localStorage.getItem('atom_goals');
    const storedCheckins = localStorage.getItem('atom_checkins');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('atom_users', JSON.stringify(initialUsers));
    }

    if (storedGoals) setGoals(JSON.parse(storedGoals));
    if (storedCheckins) setCheckins(JSON.parse(storedCheckins));
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('atom_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('atom_checkins', JSON.stringify(checkins));
  }, [checkins]);

  // Goal Operations
  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: uuidv4(), status: 'Pending', createdAt: new Date().toISOString() }]);
  };

  const updateGoal = (id, updates) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const submitGoalsForApproval = (employeeId) => {
    setGoals(goals.map(g => (g.employeeId === employeeId && g.status === 'Draft') ? { ...g, status: 'Pending' } : g));
  };
  
  const approveGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, status: 'Approved', lockedAt: new Date().toISOString() } : g));
  };

  const rejectGoal = (id, comment) => {
    setGoals(goals.map(g => g.id === id ? { ...g, status: 'Rework', managerComment: comment } : g));
  };

  const pushSharedGoal = (goalData, employeeIds) => {
    const newGoals = employeeIds.map(empId => ({
      ...goalData,
      id: uuidv4(),
      employeeId: empId,
      status: 'Approved', // Auto-approved
      isShared: true,
      lockedAt: new Date().toISOString()
    }));
    setGoals([...goals, ...newGoals]);
  };

  // Check-in Operations
  const addCheckin = (checkin) => {
    setCheckins([...checkins, { ...checkin, id: uuidv4(), date: new Date().toISOString() }]);
  };

  const addManagerComment = (checkinId, comment) => {
    setCheckins(checkins.map(c => c.id === checkinId ? { ...c, managerComment: comment } : c));
  };

  return (
    <DataContext.Provider value={{
      users,
      goals,
      checkins,
      systemDate,
      setSystemDate,
      addGoal,
      updateGoal,
      submitGoalsForApproval,
      approveGoal,
      rejectGoal,
      pushSharedGoal,
      addCheckin,
      addManagerComment
    }}>
      {children}
    </DataContext.Provider>
  );
};
