import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import CreateVm from './components/CreateVm';
import EditUser from './components/EditUser';
import EditVm from './components/EditVm';
import VmsList from './components/ListVms';
import Login from './components/Login';
import Register from './components/Register';
import UsersList from './components/UsersList';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Define /login y /register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vms"      element={<VmsList />} />
        <Route path="/vms/create" element={<CreateVm />} />
        <Route path="/vms/:id/edit" element={<EditVm />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id/edit" element={<EditUser />} />

        {/* Redirige la raíz al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Cualquier otra, también a login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
