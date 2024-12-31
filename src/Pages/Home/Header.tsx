import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="px-4 md:px-[5%] h-14 bg-purple-600">
      <div className='h-full flex items-center'>
        <Link className="flex items-center justify-center" to="#">
          <FileText className="h-6 w-6 text-white" />
          <span className="ml-2 text-lg font-bold text-white">InvoiceGen</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline text-white" href="#start">
            Features
          </a>
          <a className="text-sm font-medium hover:underline text-white" href="mailto:michaelsondev@gmail.com">Contact</a>
          <Link className="text-sm font-medium hover:underline text-white" to="/auth/login">Get Started</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header;
