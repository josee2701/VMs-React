import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';


import CompanyProductsList from './components/CompanyProductsList';
import CreateCompany from './components/CreateCompanies';
import CreateProduct from './components/CreateProduct';
import CreateStock from './components/CreateStock';
import CreateUser from './components/CreateUser';
import EditCompany from './components/EditCompanies';
import EditProduct from './components/EditProduct';
import EditStock from './components/EditStock';
import EditUser from './components/EditUser';
import CompaniesList from './components/ListCompanies';
import ProductsList from './components/ListProduct';
import Login from './components/Login';
import Register from './components/Register';
import StockList from './components/StockList';
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
          <Route path="/companies/products/:nit" element={<CompanyProductsList />} />


          <Route path="/productos" element={<ProductsList />} />
          <Route path="/productos/create" element={<CreateProduct />} />
          <Route path="/productos/edit/:cod" element={<EditProduct />} />


          <Route path="/stock" element={<StockList />} />
          <Route path="/stock/create" element={<CreateStock />} />
          <Route path="/stock/edit/:id" element={<EditStock />} />



          {/* Redirecciones */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}
