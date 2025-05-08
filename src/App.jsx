import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';


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
          <Route path="/companies" element={<CompaniesList />} />
          


          {/* Redirecciones */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}
