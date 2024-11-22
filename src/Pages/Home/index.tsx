import { Button } from '@/components/ui/button';
import Header from './Header'
import { BarChart, DollarSign, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Header />
      <section className="w-full py-20 md:py-24 lg:py-32 bg-gradient-to-b from-purple-600 to-indigo-600">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Create Professional Invoices in Seconds
              </h1>
              <p className="mx-auto max-w-[700px] text-white md:text-xl">
                Streamline your billing process with our easy-to-use invoice generator. Perfect for freelancers and small businesses.
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/invoice">
                <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500">Create Invoice</Button>
              </Link>
              <section id="start" />
              {/* <Button variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
                  Watch Demo
                </Button> */}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900">
            Features that Empower Your Business
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center shadow-lg border border-slate-100 py-6 px-10 rounded-md">
              <div className="bg-green-100 p-4 rounded-full">
                <Zap className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Lightning Fast</h3>
              <p className="text-gray-500">Create and send invoices in just a few clicks, saving you time and effort.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center shadow-lg border border-slate-100 py-6 px-10 rounded-md">
              <div className="bg-blue-100 p-4 rounded-full">
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Multiple Currencies</h3>
              <p className="text-gray-500">Support for various currencies to cater to your global clientele.</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center shadow-lg border border-slate-100 py-6 px-10 rounded-md">
              <div className="bg-red-100 p-4 rounded-full">
                <BarChart className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Insightful Analytics</h3>
              <p className="text-gray-500">Track your income and get valuable insights into your business performance.</p>
            </div>
          </div>
        </div>
      </section>
      {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
              <p className="text-gray-500 mb-4">"This invoice generator has saved me hours every week. It's intuitive and powerful!"</p>
              <p className="text-gray-900 font-semibold">- Sarah K., Freelance Designer</p>
            </div>
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
              <p className="text-gray-500 mb-4">"The multi-currency support is a game-changer for my international business."</p>
              <p className="text-gray-900 font-semibold">- Alex M., E-commerce Owner</p>
            </div>
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg">
              <p className="text-gray-500 mb-4">"I love the analytics feature. It helps me understand my cash flow better."</p>
              <p className="text-gray-900 font-semibold">- Chris L., Startup Founder</p>
            </div>
          </div>
        </div>
      </section> */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-indigo-600 to-purple-600">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Simplify Your Invoicing?
              </h2>
              <p className="mx-auto max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied users and start creating professional invoices today.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Link to="/invoice" className='inline-block'>
                <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-500" type="submit">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-purple-600">
        <p className="text-xs text-white">© {new Date().getFullYear()} InvoiceMaker. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-white" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-white" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  )
}

export default Home;
