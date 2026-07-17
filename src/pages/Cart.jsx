import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif tracking-wide">Your cart is empty</h2>
        <p className="text-gray-600 mb-10 text-lg">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="bg-[#46114b] text-white px-10 py-4 font-semibold uppercase tracking-widest text-sm hover:bg-opacity-90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      
      <div className="space-y-6 mb-16">
        {cartItems.map((item) => (
          <div key={item.id} className="border border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row gap-6 bg-white relative">
            <div className="w-full sm:w-32 h-64 sm:h-40 shrink-0 bg-gray-50">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wide">{item.name}</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 text-sm">Color:</span>
                      <div className="w-5 h-5 rounded-full bg-green-600"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900 text-sm">Size:</span>
                      <span className="font-bold text-gray-900 text-sm">M</span>
                    </div>
                  </div>
                </div>
                <div className="text-primary font-bold text-lg sm:text-right">
                  NGN {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-8 sm:mt-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-900 text-sm">Qty:</span>
                  <div className="flex items-center border border-gray-300 h-10 w-28">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-1/3 h-full text-gray-600 hover:bg-gray-50 flex items-center justify-center text-lg"
                    >-</button>
                    <span className="w-1/3 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-1/3 h-full text-gray-600 hover:bg-gray-50 flex items-center justify-center text-lg"
                    >+</button>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
                >
                  <Trash2 size={18} className="text-yellow-600" />
                  <span className="hidden sm:inline">Remove from cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary box */}
      <div className="border border-gray-300 max-w-2xl mx-auto p-8 sm:p-12 bg-white mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Order Summary</h2>
        
        <div className="flex justify-between items-center text-lg mb-10">
          <span className="text-gray-900">Subtotal ({cartCount} items)</span>
          <span className="font-bold text-gray-900">NGN {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        
        <Link 
          to="/checkout" 
          className="w-full block text-center bg-[#46114b] text-white py-4 font-bold text-lg hover:bg-opacity-90 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
