import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';


import CreateCompany from './components/CreateCompanies';
import CreateUser from './components/CreateUser';
import EditCompany from './components/EditCompanies';
import EditUser from './components/EditUser';
import CompaniesList from './components/ListCompanies';
import Login from './components/Login';
import Register from './components/Register';
import UsersList from './components/UsersList';
export default function App() {
  return (
      <Router>
        <Routes>
          {/* Autenticación */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UsersList />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/users/create" element={<CreateUser />} />

          {/* Compañías */}
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/companies/create" element={<CreateCompany />} />
          <Route path="/companies/edit/:nit" element={<EditCompany />} />

          


          {/* Redirecciones */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}
