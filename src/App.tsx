import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthenticatedUsers from './pages/AuthenticatedUsers';
import Administrators from './pages/Administrators';
import Missionaries from './pages/Missionaries';
import Sponsors from './pages/Sponsors';
import Messages from './pages/Messages';
import Pending from './pages/Pending';
import MissionaryDashboard from './pages/MissionaryDashboard';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/authenticated-users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AuthenticatedUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/administrators"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Administrators />
                </ProtectedRoute>
              }
            />
            <Route
              path="/missionaries"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Missionaries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sponsors"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Sponsors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Pending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/missionary-dashboard"
              element={
                <ProtectedRoute>
                  <MissionaryDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;