import { Navigate, Outlet } from 'react-router-dom';

const token = sessionStorage.getItem('token');

const ProtectedRoute = () => {
  return token ? <Outlet /> : <Navigate to="/auth/login" />
}

export default ProtectedRoute