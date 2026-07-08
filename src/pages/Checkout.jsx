import { useCart } from '../context/CartContext';
import { Truck, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Order placed successfully! Thank you for shopping with Florecers.');
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif tracking-wide">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="bg-[#46114b] text-white px-10 py-4 font-semibold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  const shippingFee = 5000;
  const vat = 6000;
  const grandTotal = cartTotal + shippingFee + vat;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column - Form */}
          <div className="flex-1 order-1">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Ship / Pickup */}
              <div className="border border-gray-300 bg-white shadow-sm">
                <label className="flex items-center justify-between p-5 border-b border-gray-300 cursor-pointer bg-orange-50/40 hover:bg-orange-50/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="delivery" defaultChecked className="w-5 h-5 accent-[#46114b]" />
                    <span className="text-lg text-gray-900">Ship <span className="text-xs text-gray-500 ml-2">(Delivered within 5-10 working days)</span></span>
                  </div>
                  <Truck size={24} className="text-[#46114b]" />
                </label>
                <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="delivery" className="w-5 h-5 accent-[#46114b]" />
                    <span className="text-lg text-gray-900">Pickup in store</span>
                  </div>
                  <Store size={24} className="text-[#46114b]" />
                </label>
              </div>

              {/* Shipping address */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">Shipping address</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-800 mb-2">Full name</label>
                    <input type="text" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white" placeholder="Jane Doe" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 mb-2">Email</label>
                    <input type="email" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white" placeholder="janedoe@gmail.com" required />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 mb-2">Country/Region</label>
                    <select className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white">
                      <option>Nigeria</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 mb-2">Address</label>
                    <input type="text" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white h-14" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-gray-800 mb-2">City</label>
                      <input type="text" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-2">State</label>
                      <input type="text" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-800 mb-2">Postal code (optional)</label>
                      <input type="text" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-800 mb-2">Phone</label>
                    <input type="text" className="w-full border border-gray-300 p-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-sm shadow-sm bg-white h-14" required />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input type="checkbox" className="w-5 h-5 accent-[#46114b] rounded-sm" />
                    <span className="text-sm text-gray-800">Save this information</span>
                  </label>
                </div>
              </div>

              {/* Payment */}
              <div className="pt-2">
                <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">Payment</h2>
                <div className="border border-gray-300 bg-white shadow-sm">
                  <label className="flex items-center gap-4 p-5 border-b border-gray-300 cursor-pointer bg-orange-50/40 hover:bg-orange-50/60 transition-colors">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-[#46114b]" />
                    <span className="text-lg text-gray-900">Bank Card</span>
                  </label>
                  <label className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment" className="w-5 h-5 accent-[#46114b]" />
                    <span className="text-lg text-gray-900">Bank transfer</span>
                  </label>
                </div>
              </div>

              {/* Proceed to Pay button for desktop */}
              <div className="hidden lg:block pt-8">
                <button type="submit" className="w-full bg-[#46114b] text-white py-5 font-bold text-lg hover:bg-opacity-90 shadow-md">
                  Proceed to Pay
                </button>
              </div>

            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[480px] order-2 lg:order-2">
            <div className="border border-gray-300 p-8 bg-white shadow-sm lg:sticky lg:top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center tracking-wide">Order Summary</h2>
              
              <div className="space-y-8 mb-10">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 h-32 flex-shrink-0 bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                      <h3 className="font-bold text-gray-900 uppercase text-sm tracking-widest">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-900 text-sm">Color:</span>
                        <div className="w-5 h-5 rounded-full bg-green-600"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm">Size:</span>
                        <span className="font-bold text-gray-900 text-sm">M</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm">Qty:</span>
                        <span className="font-bold text-gray-900 text-sm">{item.quantity}</span>
                      </div>
                      <div className="text-primary font-bold text-sm pt-2">
                        Price: NGN {(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-5 pt-8 border-t border-gray-300">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-800">Subtotal ({cartCount} items)</span>
                  <span className="font-bold text-gray-900">NGN {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-800">Shipping fee</span>
                  <span className="font-bold text-gray-900">NGN {shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-800">VAT</span>
                  <span className="font-bold text-gray-900">NGN {vat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-2">
                  <span className="text-2xl text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-gray-900">NGN {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            
            {/* Proceed to Pay button for mobile */}
            <div className="block lg:hidden mt-8 mb-8">
              <button onClick={handleSubmit} className="w-full bg-[#46114b] text-white py-5 font-bold text-lg hover:bg-opacity-90 shadow-md">
                Proceed to Pay
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
