import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CropList from './components/crops/CropList';
import CropForm from './components/crops/CropForm';
import ResourceList from './components/resources/ResourceList';
import ResourceForm from './components/resources/ResourceForm';
import ResourceRequests from './components/resources/ResourceRequests';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/crops" element={
                <PrivateRoute>
                  <CropList />
                </PrivateRoute>
              } />
              <Route path="/crops/new" element={
                <PrivateRoute>
                  <CropForm />
                </PrivateRoute>
              } />
              <Route path="/resources" element={
                <PrivateRoute>
                  <ResourceList />
                </PrivateRoute>
              } />
              <Route path="/resources/new" element={
                <PrivateRoute>
                  <ResourceForm />
                </PrivateRoute>
              } />
              <Route path="/resources/requests" element={
                <PrivateRoute>
                  <ResourceRequests />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App