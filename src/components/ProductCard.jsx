import { ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [likedItems, setLikedItems] = useState([]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const toggleLike = (id) => {
    setLikedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Add to Cart Overlay */}
        <div
          className={`absolute bottom-8 left-0 right-0 bg-white bg-opacity-95 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          <div className="flex justify-between items-center px-4 py-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="flex items-center text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
            >
              Add To Cart <ArrowRight size={16} className="ml-2" />
            </button>
            <button className="text-gray-900 hover:text-primary transition-colors">
              <FaHeart
                onClick={() => toggleLike(product.id)}
                className={`cursor-pointer transition-colors text-[18px] ${
                  likedItems.includes(product.id)
                    ? "text-pink-500"
                    : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          {product.name}
        </h3>
        <p className="text-primary font-semibold">
          NGN{" "}
          {product.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
