import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import CreateAssessment from './pages/CreateAssessment';
import Competencies from './pages/Competencies';
import Stores from './pages/Stores';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import EmployeeDashboard from './pages/EmployeeDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Employee-Only Route Component
const EmployeeRoute = ({ children }) => {
  const { isAuthenticated, isEmployee } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isEmployee) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { isEmployee } = useAuth();

  // If employee is logged in, redirect to employee dashboard
  if (isEmployee) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/employee-dashboard"
          element={
            <EmployeeRoute>
              <EmployeeDashboard />
            </EmployeeRoute>
          }
        />
        <Route path="*" element={<Navigate to="/employee-dashboard" />} />
      </Routes>
    );
  }

  // Regular routes for staff users
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employees/new"
        element={
          <ProtectedRoute>
            <AddEmployee />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employees/:id/edit"
        element={
          <ProtectedRoute>
            <EditEmployee />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employees/:id"
        element={
          <ProtectedRoute>
            <EmployeeDetail />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/assessments"
        element={
          <ProtectedRoute>
            <CreateAssessment />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/competencies"
        element={
          <ProtectedRoute>
            <Competencies />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <Stores />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
