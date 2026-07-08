import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';

// Image imports
import img1 from '../assets/images/Frame 14.png';
import img2 from '../assets/images/Frame 13.png';
import img3 from '../assets/images/Frame 79.png';
import img4 from '../assets/images/Frame 84.png';
import img5 from '../assets/images/Frame 86.png';
import img6 from '../assets/images/Frame 85.png';
import img7 from '../assets/images/Frame 15.png';
import img8 from '../assets/images/Frame 8.png';
import bannerImg from '../assets/images/6604ac4bcddcc0c2b56f377769287501c0e88cff.jpg';

const PRODUCTS = [
  { id: 1, name: "ARIANA IN BLUE ADIRE", price: 85000, image: img1 },
  { id: 2, name: "EDEN IN ADIRE", price: 90000, image: img2 },
  { id: 3, name: "ARIANA DRESS IN BROCADE", price: 85000, image: img3 },
  { id: 4, name: "TARE SET", price: 110000, image: img4 },
  { id: 5, name: "NAOOMI", price: 70000, image: img5 },
  { id: 6, name: "HARA", price: 60000, image: img6 },
  { id: 7, name: "ASAKE SHORT SET", price: 100000, image: img7 },
  { id: 8, name: "ARIYIKE", price: 250000, image: img8 },
  { id: 9, name: "ARIANA IN BLUE ADIRE", price: 85000, image: img1 },
  { id: 10, name: "EDEN IN ADIRE", price: 90000, image: img2 },
  { id: 11, name: "ARIANA DRESS IN BROCADE", price: 85000, image: img3 },
  { id: 12, name: "TARE SET", price: 110000, image: img4 },
  { id: 13, name: "NAOOMI", price: 70000, image: img5 },
  { id: 14, name: "HARA", price: 60000, image: img6 },
  { id: 15, name: "ASAKE SHORT SET", price: 100000, image: img7 },
  { id: 16, name: "ARIYIKE", price: 250000, image: img8 },
  
];

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden bg-primary-dark">
        <img src={bannerImg} alt="Shop banner" className="object-cover w-full h-full opacity-90 mix-blend-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-7xl font-bold tracking-wider font-serif">Shop</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        
        {/* Mobile Filter Button */}
        <div className="md:hidden flex justify-start mb-6">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 font-bold text-gray-900 bg-gray-50 border border-gray-200 px-4 py-2 rounded-sm"
          >
            <SlidersHorizontal size={18} className="text-primary" /> Filter
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Overlay for mobile filter */}
          {isFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Sidebar Filters - Desktop & Mobile Drawer */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-80 bg-white p-6 overflow-y-auto transition-transform duration-300 transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-64 md:p-0 md:bg-transparent md:z-auto shrink-0 shadow-2xl md:shadow-none`}>
            
            {/* Mobile Close Header */}
            <div className="md:hidden flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <SlidersHorizontal size={20} />
                <span className="text-lg uppercase tracking-wide">Filter</span>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-10">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full border border-gray-300 rounded-sm py-2.5 px-4 pr-10 focus:outline-none focus:border-primary text-sm"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {/* Filter Toggle Header (Desktop) */}
              <div className="hidden md:flex items-center gap-2 text-gray-900 font-bold border-b border-gray-200 pb-3">
                <SlidersHorizontal size={20} />
                <span className="text-lg uppercase tracking-wide">Filter</span>
              </div>

              {/* Out of Stock */}
              <div>
                <div className="bg-primary text-white p-4 font-bold uppercase tracking-wider text-sm mb-4">
                  OUT OF STOCK
                </div>
                <div className="space-y-4 px-2">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Show</span>
                    <input type="radio" name="stock" className="accent-primary" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Hide</span>
                    <input type="radio" name="stock" className="accent-primary" />
                  </label>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="bg-primary text-white p-4 font-bold uppercase tracking-wider text-sm mb-6">
                  PRICE
                </div>
                <div className="px-2">
                  <div className="flex justify-between text-xs font-bold text-gray-800 mb-4 tracking-wider">
                    <span>NGN 0.00</span>
                    <span>NGN 500,000.00</span>
                  </div>
                  <input type="range" min="0" max="500000" className="w-full accent-primary" />
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="bg-primary text-white p-4 font-bold uppercase tracking-wider text-sm mb-4">
                  SIZE
                </div>
                <div className="px-2 space-y-4">
                  {['XS', 'S', 'M', 'L', 'XL', '1XL', '1XL2', '2XL', '2XL2', '3XL', '4XL'].map(size => (
                    <div key={size} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{size}</span>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-200 pb-3 mb-4">
                  <span className="text-lg uppercase tracking-wide">Sort By</span>
                </div>
                <div className="px-2 space-y-4">
                  {['Bestselling', 'Alphabetically, A-Z', 'Alphabetically, Z-A', 'Date, Oldest To Newest', 'Date, Newest To Oldest'].map(sort => (
                    <div key={sort} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{sort}</span>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </aside>

          {/* Product Grid Container */}
          <div className="flex-1 w-full overflow-hidden">
            
            {/* Mobile View: Independent Scrolling Rows */}
            <div className="md:hidden space-y-8">
              {PRODUCTS.reduce((rows, product, index) => {
                if (index % 4 === 0) rows.push([]);
                rows[rows.length - 1].push(product);
                return rows;
              }, []).map((row, index) => (
                <div key={index} className="w-full overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  <div className="flex gap-4 w-max">
                    {row.map(product => (
                      <div key={product.id} className="w-[60vw] sm:w-[45vw]">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Normal Grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-6 gap-y-12">
              {PRODUCTS.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
