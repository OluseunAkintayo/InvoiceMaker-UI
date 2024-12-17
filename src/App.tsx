import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './Pages/Auth/Signup.tsx';
import Login from './Pages/Auth/Login.tsx';
import NewInvoice from './Pages/NewInvoice/index.tsx';
import ResetPassword from './Pages/Auth/ResetPassword.tsx';
import NotFound from './Pages/NotFound';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home/index.tsx';
import Invoices from './Pages/Dashboard/Invoices/index.tsx';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <NewInvoice />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/auth/register",
      element: <Signup />
    },
    {
      path: "/auth/login",
      element: <Login />
    },
    {
      path: "/auth/reset-password",
      element: <ResetPassword />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      path: "/dashboard/invoices",
      element: <Invoices />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return <RouterProvider router={router} />
}

export default App;
