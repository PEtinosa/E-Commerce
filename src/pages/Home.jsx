import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import heroImg from "../assets/images/Property 1=Frame 14.png";
import feat1 from "../assets/images/Frame 84.png";
import feat2 from "../assets/images/Frame 85.png";
import feat3 from "../assets/images/Frame 86.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden bg-[#2c0730]">
        <img
          src={heroImg}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl md:text-8xl font-bold tracking-widest font-serif mb-6 uppercase">
            Florecers
          </h1>
          <p className="text-gray-100 text-lg md:text-xl font-medium tracking-wide mb-10 max-w-2xl">
            Discover the new standard of elegance. Curated pieces for the modern
            wardrobe.
          </p>
          <Link
            to="/shop"
            className="group flex items-center gap-3 bg-white text-[#46114b] px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors"
          >
            Shop Now
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-widest font-serif mb-4">
            New Arrivals
          </h2>
          <div className="h-1 w-20 bg-[#46114b]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Item 1 */}
          <Link
            to="/shop"
            className="group flex flex-col items-center cursor-pointer"
          >
            <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
              <img
                src={feat1}
                alt="New Arrival 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-wider uppercase">
              The Signature Collection
            </h3>
            <p className="text-gray-500 mt-2 text-sm">Explore now</p>
          </Link>

          {/* Item 2 */}
          <Link
            to="/shop"
            className="group flex flex-col items-center cursor-pointer md:-mt-12"
          >
            <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
              <img
                src={feat2}
                alt="New Arrival 2"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-wider uppercase">
              Vibrant Adire
            </h3>
            <p className="text-gray-500 mt-2 text-sm">Explore now</p>
          </Link>

          {/* Item 3 */}
          <Link
            to="/shop"
            className="group flex flex-col items-center cursor-pointer"
          >
            <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
              <img
                src={feat3}
                alt="New Arrival 3"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-wider uppercase">
              Modern Classics
            </h3>
            <p className="text-gray-500 mt-2 text-sm">Explore now</p>
          </Link>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gray-50 py-20 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif italic text-gray-900 mb-6">
            "Clothing that speaks before you do."
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            At Florecers, we believe in the power of expression through premium,
            meticulously crafted garments. Every piece in our collection is
            designed to bring out your inner confidence.
          </p>
          <Link
            to="/shop"
            className="inline-block border-b-2 border-[#46114b] text-[#46114b] font-bold uppercase tracking-widest pb-1 hover:text-opacity-70 transition-colors"
          >
            Discover the Brand
          </Link>
        </div>
      </div>
    </div>
  );
}
