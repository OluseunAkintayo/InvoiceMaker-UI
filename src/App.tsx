import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home/index.tsx';
import Signup from './Pages/Auth/Signup.tsx';
import Login from './Pages/Auth/Login.tsx';
import NewInvoice from './Pages/NewInvoice/index.tsx';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
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
      path: "/new-invoice",
      element: <NewInvoice />
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App;
