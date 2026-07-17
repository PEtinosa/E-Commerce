import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import logo from '../../assets/images/1 2.png';
import logo1 from '../../assets/images/2 2.png';

export default function Navbar() {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we are on a page that needs a special mobile header
  const isSpecialPage = location.pathname === '/cart' || location.pathname === '/checkout';
  
  const getPageTitle = () => {
    if (location.pathname === '/cart') return 'Cart';
    if (location.pathname === '/checkout') return 'Checkout';
    return '';
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP NAVBAR (Always the same) */}
        <div className="hidden md:flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo1} alt="Logo" className="h-10" />
              <img src={logo} alt="Logo" className="h-10" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-10">
            <Link to="/" className="text-sm font-medium text-gray-800 hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-sm font-bold text-primary transition-colors">Shop</Link>
            {/* <Link to="#" className="text-sm font-medium text-gray-800 hover:text-primary transition-colors">Feed</Link> */}
          </div>

          {/* Icons (Search, Cart) */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-900 hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="relative text-gray-900 hover:text-primary transition-colors group">
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE NAVBAR */}
        <div className="flex md:hidden justify-between items-center h-16">
          {isSpecialPage ? (
            // Mobile Header for Cart / Checkout
            <>
              <div className="w-1/3 flex justify-start">
                <button onClick={() => navigate(-1)} className="text-gray-900 hover:text-primary">
                  <ArrowLeft size={24} />
                </button>
              </div>
              <div className="w-1/3 flex justify-center">
                <span className="text-lg font-bold text-gray-900 tracking-wide uppercase">
                  {getPageTitle()}
                </span>
              </div>
              <div className="w-1/3 flex justify-end items-center gap-5">
                <button className="text-gray-900 hover:text-primary transition-colors">
                  <Search size={20} />
                </button>
                <Link to="/cart" className="relative text-gray-900 hover:text-primary transition-colors">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </>
          ) : (
            // Mobile Header for Shop / Home
            <>
              <div className="w-1/3 flex justify-start">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-900 hover:text-primary transition-colors"
                >
                  <Menu size={24} />
                </button>
              </div>
              
              <div className="w-1/3 flex justify-center">
                <Link to="/" className="flex items-center gap-1 h-8">
                  <img src={logo1} alt="Logo" className="h-full w-auto" />
                  <img src={logo} alt="Logo" className="h-full w-auto" />
                </Link>
              </div>

              <div className="w-1/3 flex justify-end items-center gap-5">
                <button className="text-gray-900 hover:text-primary transition-colors">
                  <Search size={20} />
                </button>
                <Link to="/cart" className="relative text-gray-900 hover:text-primary transition-colors">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isSpecialPage && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md">Home</Link>
          <Link to="/shop" className="block px-3 py-2 text-base font-medium text-primary bg-primary/5 rounded-md">Shop</Link>
          <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md">Feed</Link>
        </div>
      )}
    </nav>
  );
}
