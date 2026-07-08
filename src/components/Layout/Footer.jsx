import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-white pt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-primary tracking-wider uppercase font-serif italic">
                Florecers
              </span>
            </Link>
            <ul className="space-y-3 mt-6">
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">About us</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Conditions</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Careers</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Returns & Refunds</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Cookie guidelines</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">FAQ</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Contact</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Privacy policy</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-primary text-sm">Delivery information</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="text-sm text-gray-600">
                <span className="block mb-1">Do you have any questions or suggestions?</span>
                <a href="mailto:ourservices@templatesjungle.com" className="text-primary font-medium hover:underline border-b border-primary pb-0.5">
                  ourservices@templatesjungle.com
                </a>
              </li>
              <li className="text-sm text-gray-600">
                <span className="block mb-1">Do you need assistance? Give us a call.</span>
                <a href="tel:+57444110035" className="font-medium text-gray-900">
                  +57 444 11 00 35
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-6">Our Socials</h3>
            <p className="text-sm text-gray-600 mb-4">Follow us on all our social media handles</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-900 hover:text-primary transition-colors"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-900 hover:text-primary transition-colors"><FaInstagram size={24} /></a>
              <a href="#" className="text-gray-900 hover:text-primary transition-colors"><FaLinkedin size={24} /></a>
              <a href="#" className="text-gray-900 hover:text-primary transition-colors"><FaTwitter size={24} /></a>
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="bg-primary py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-sm opacity-90">
            © Copyrights {new Date().getFullYear()} Florecers. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
