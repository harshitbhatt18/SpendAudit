import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import {Dashboard, DashboardHome} from './Components/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ExpenseProvider } from './contexts/ExpenseContext.jsx';
import TransactionHistory from './Components/SidebarComponents/TransactionHistory';
import Reports from './Components/SidebarComponents/Reports';
import Settings from './Components/SidebarComponents/Settings';
import Help from './Components/SidebarComponents/Help';
import Guides from './Components/SidebarComponents/Guides';

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard>
                    <Routes>
                      <Route path="/" element={<DashboardHome />} />
                      <Route path="/transactions" element={<TransactionHistory />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/guides" element={<Guides />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<Help />} />
                    </Routes>
                  </Dashboard>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
