import { Navigate, Route, Routes, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import PublicProfile from './pages/PublicProfile';
import EditProfile from './pages/EditProfile';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="app-shell">
      <nav className="topbar">
        <Link to="/" className="brand">TripVault</Link>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<PublicProfile />} />
      </Routes>
    </div>
  );
}

export default App;
