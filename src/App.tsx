import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SecurityProvider } from './contexts/SecurityContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FileManager from './pages/FileManager';
import UserManagement from './pages/UserManagement';
import SecuritySettings from './pages/SecuritySettings';
import AuditLogs from './pages/AuditLogs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/app" element={<Layout />}>
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="files" element={
                  <ProtectedRoute>
                    <FileManager />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="security" element={
                  <ProtectedRoute>
                    <SecuritySettings />
                  </ProtectedRoute>
                } />
                <Route path="audit" element={
                  <ProtectedRoute roles={['admin']}>
                    <AuditLogs />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </div>
        </Router>
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;