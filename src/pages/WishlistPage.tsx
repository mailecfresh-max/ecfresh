import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/common/ProductCard';

const WishlistPage: React.FC = () => {
  const { items, clear, remove } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save products you love and buy them later</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const moveAllToCart = () => {
    items.forEach(({ product }) => {
      const firstVariant = product.variants[0];
      addToCart(product, firstVariant, 1);
    });
    clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={moveAllToCart}
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Move all to cart</span>
            </button>
            <button
              onClick={clear}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Clear wishlist
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ product }) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => remove(product.id)}
                  className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow hover:bg-white"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;


