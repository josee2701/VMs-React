import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';

import { WSProvider } from './services/WSProvider';

import CreateVm from './components/CreateVm';
import EditUser from './components/EditUser';
import EditVm from './components/EditVm';
import VmsList from './components/ListVms';
import Login from './components/Login';
import Register from './components/Register';
import UsersList from './components/UsersList';
import ViewVm from './components/ViewVms';

export default function App() {
  return (
    <WSProvider>
      <Router>
        <Routes>
          {/* Autenticación */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* VMs */}
          <Route path="/vms"           element={<VmsList />} />
          <Route path="/vms/create"    element={<CreateVm />} />
          <Route path="/vms/:id"       element={<ViewVm />} />
          <Route path="/vms/:id/edit"  element={<EditVm />} />

          {/* Usuarios */}
          <Route path="/users"        element={<UsersList />} />
          <Route path="/users/:id/edit" element={<EditUser />} />

          {/* Redirecciones */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </WSProvider>
  );
}
