import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="px-4 md:px-[5%] h-14 bg-purple-600">
      <div className='h-full flex items-center'>
        <Link className="flex items-center justify-center" to="#">
          <FileText className="h-6 w-6 text-white" />
          <span className="ml-2 text-lg font-bold text-white">InvoiceMaker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline text-white" to="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline text-white" to="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline text-white" to="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline text-white" to="#">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header;
