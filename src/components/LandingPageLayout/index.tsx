import { FileText } from 'lucide-react';
import React from 'react'
// import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import '@/Pages/NewInvoice/builder.css';

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
    <div className='ib min-h-[100dvh] bg-canvas'>
      <header className='ib-glass sticky top-0 z-30 shadow-[0_1px_0_rgba(12,13,15,0.08)]'>
        <div className='mx-auto max-w-[1360px] h-16 px-4 sm:px-6 flex items-center gap-4'>
          <div className="flex items-center gap-2.5">
            <span className="grid place-items-center size-7 rounded-lg bg-ink text-white">
              <FileText className="size-4" strokeWidth={1.75} />
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.01em]">InvoiceGen</span>
          </div>
          <button
            type="button"
            onClick={login}
            className='ib-press ml-auto h-10 px-4 rounded-full bg-white text-[14px] font-medium text-ink shadow-[inset_0_0_0_1px_rgba(12,13,15,0.14)] hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/40'
          >
            Log in / Sign up
          </button>
          {/* {!isLoggedIn && <Link to="/auth/login"><Button>Login / Signup</Button></Link>} */}
        </div>
      </header>
      {children}
    </div>
  )
}

export default LandingPageLayout;
