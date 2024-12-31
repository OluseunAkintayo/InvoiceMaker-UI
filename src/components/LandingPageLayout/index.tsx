import { FileText } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
// import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ILandingPageLayout {
  children: React.ReactNode;
}

const LandingPageLayout = ({ children }: ILandingPageLayout) => {
  React.useEffect(() => {
    sessionStorage.setItem('url', window.location.pathname);
  }, []);

  // const isLoggedIn: string | null = localStorage.getItem('token');

  const toast = useToast().toast;

  const login = () => {
    toast({
      className: 'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      title: 'Available soon.',
    });
  }

  return (
    <>
      <header className='bg-slate-100/20 shadow-md shadow-slate-200'>
        <div className='container px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-700 rounded-tr-md rounded-bl-md"><FileText className="text-white" /></span>
              <h3 className="text-2xl font-semibold text-slate-700">InvoiceGen</h3>
            </div>
            <Button onClick={login}>Login / Signup</Button>
            {/* {!isLoggedIn && <Link to="/auth/login"><Button>Login / Signup</Button></Link>} */}
          </div>
        </div>
      </header>
      {children}
    </>
  )
}

export default LandingPageLayout;
