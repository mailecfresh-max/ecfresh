import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, Info, Clock, Award, Plus, Minus, ShoppingCart, Salad, Coffee, Carrot } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Product, ProductVariant } from '../types';
import { useAdminData } from '../hooks/useAdminData';
import { getFromLocalStorage, LOCAL_STORAGE_KEYS } from '../utils/localStorage';
import { getAvailableTimeSlots, formatTimeSlot } from '../utils/timeSlots';
import toast from 'react-hot-toast';
import { useWishlist } from '../hooks/useWishlist';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('nutrition');
  const [activeSection, setActiveSection] = useState<'reviews'>('reviews');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, items } = useCart();
  const { toggle: toggleWishlistGlobal, isWishlisted } = useWishlist();
  const { products } = useAdminData();
  const navigate = useNavigate();

  // Fetch product data
  useEffect(() => {
    // Simulate API call with timeout
    setIsLoading(true);
    setTimeout(() => {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedVariant(foundProduct.variants[0]);
      }
      setIsLoading(false);
    }, 500);
  }, [productId, products]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [productId]);

  // Check if product is in cart
  const existingCartItem = product && selectedVariant ? items.find(
    item => item.productId === product.id && item.variant.weight === selectedVariant.weight
  ) : null;
  
  const currentQuantity = existingCartItem?.quantity || quantity;

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    addToCart(product, selectedVariant, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  // Toggle wishlist using global wishlist context
  const toggleWishlist = () => {
    if (!product) return;
    const currentlyWishlisted = isWishlisted(product.id);
    toggleWishlistGlobal(product);
    toast.success(currentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Get estimated delivery date (tomorrow + 1 day)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 2); // Delivery in 2 days
    
    return deliveryDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Calculate loyalty points (10% of price)
  const calculateLoyaltyPoints = () => {
    if (!selectedVariant) return 0;
    return Math.round(selectedVariant.price * 0.1);
  };

  // Next available delivery slot
  const nextAvailableSlot = useMemo(() => {
    const slots = getAvailableTimeSlots();
    return slots.find(s => s.available) || null;
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/shop" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link to="/shop" className="hover:text-green-600">Shop</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link 
              to={`/shop?category=${product.category}`} 
              className="hover:text-green-600"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-gray-700 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="px-4 pt-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Product Image */}
            <div className="md:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="product-image-container"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className=""
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
                
                {/* Wishlist Button */}
                <button 
                  onClick={toggleWishlist}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm"
                >
                  <Heart 
                    className={`w-5 h-5 ${product && isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </button>
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 pt-6 md:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {/* Variants */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Choose Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button
                        key={variant.weight}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                          selectedVariant.weight === variant.weight
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {variant.weight}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">₹{selectedVariant.price}</span>
                    {selectedVariant.originalPrice && (
                      <span className="text-gray-500 line-through">₹{selectedVariant.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                </div>
 
                {/* Inline Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.isAvailable}
                    className={`flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-white font-medium transition-colors ${product.isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'}`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{existingCartItem ? 'Update Cart' : 'Add to Cart'}</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.isAvailable}
                    className={`flex-1 px-5 py-3 rounded-xl font-medium transition-colors border ${product.isAvailable ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-300 text-gray-400'}`}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Stock Info */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${product.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Next available delivery slot:
                        {nextAvailableSlot ? (
                          <>
                            {' '}
                            {new Date(nextAvailableSlot.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {formatTimeSlot(nextAvailableSlot.timeSlot)}
                          </>
                        ) : (
                          ' Check back soon'
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">We’ll pack it fresh & fast</p>
                    </div>
                  </div>
                </div>

                {/* Loyalty Points */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Buy this, get ₹{calculateLoyaltyPoints()} cashback</h3>
                      <p className="text-sm text-gray-600">You will get ₹{calculateLoyaltyPoints()} cashback for it</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Actions - mobile (bottom, above mobile menu) */}
      <div className="md:hidden fixed left-0 right-0 bg-white border-t border-gray-200 p-3 z-40" style={{ bottom: '5rem', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-gray-100 rounded-full">
              <button
                onClick={() => handleQuantityChange(currentQuantity - 1)}
                disabled={currentQuantity <= 1}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full transition-colors disabled:opacity-50"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-4 py-1 font-medium text-gray-900 min-w-[2.5rem] text-center">
                {currentQuantity}
              </span>
              <button
                onClick={() => handleQuantityChange(currentQuantity + 1)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBuyNow}
                disabled={!product.isAvailable}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${product.isAvailable ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-300 text-gray-400'}`}
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm text-white font-medium transition-all ${product.isAvailable ? 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-md active:scale-95' : 'bg-gray-400'}`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{existingCartItem ? 'Update' : 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <section className="px-4 py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveSection('reviews')}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-green-700 shadow-sm"
              >
                Customer Reviews
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="py-2"
            >
              <div className="bg-white rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Reviews</h3>
                <p className="text-gray-600">Reviews coming soon.</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Sticky Add to Cart (mobile version) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-100 rounded-full">
                  <button
                    onClick={() => handleQuantityChange(currentQuantity - 1)}
                    disabled={currentQuantity <= 1}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 font-medium text-gray-900 min-w-[2rem] text-center">
                    {currentQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(currentQuantity + 1)}
                    className="p-1.5 text-gray-600 hover:text-gray-900 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <p className="font-bold text-gray-900">₹{selectedVariant.price * currentQuantity}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleBuyNow}
                disabled={!product.isAvailable}
                className={`flex-1 py-2.5 rounded-full font-medium text-sm transition-all border ${product.isAvailable ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-300 text-gray-400'}`}
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className={`flex-1 flex items-center justify-center space-x-1 py-2.5 rounded-full text-white font-medium text-sm transition-all ${product.isAvailable ? 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-md active:scale-95' : 'bg-gray-400'}`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{existingCartItem ? 'Update Cart' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Add to Cart (desktop only) */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-full">
                <button
                  onClick={() => handleQuantityChange(currentQuantity - 1)}
                  disabled={currentQuantity <= 1}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full transition-colors disabled:opacity-50"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-4 py-1 font-medium text-gray-900 min-w-[2.5rem] text-center">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(currentQuantity + 1)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div>
                <p className="font-bold text-gray-900">₹{selectedVariant.price * currentQuantity}</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ProductDetailPage;
