import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Components
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeGoals from './pages/employee/Goals';
import EmployeeCheckin from './pages/employee/Checkin';
import ManagerApprovals from './pages/manager/Approvals';
import ManagerCheckins from './pages/manager/Checkins';
import AdminSharedGoals from './pages/admin/SharedGoals';
import AdminAudit from './pages/admin/Audit';

// Protect routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
  
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Employee Routes */}
          <Route path="/employee/goals" element={
            <ProtectedRoute allowedRoles={['Employee']}><EmployeeGoals /></ProtectedRoute>
          } />
          <Route path="/employee/checkin" element={
            <ProtectedRoute allowedRoles={['Employee']}><EmployeeCheckin /></ProtectedRoute>
          } />
          
          {/* Manager Routes */}
          <Route path="/manager/approvals" element={
            <ProtectedRoute allowedRoles={['Manager']}><ManagerApprovals /></ProtectedRoute>
          } />
          <Route path="/manager/checkins" element={
            <ProtectedRoute allowedRoles={['Manager']}><ManagerCheckins /></ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/shared-goals" element={
            <ProtectedRoute allowedRoles={['Admin']}><AdminSharedGoals /></ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute allowedRoles={['Admin']}><AdminAudit /></ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
