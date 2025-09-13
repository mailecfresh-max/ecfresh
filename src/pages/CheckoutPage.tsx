import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { getAvailableTimeSlots, formatTimeSlot, TimeSlot } from '../utils/timeSlots';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage } from '../utils/localStorage';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  // Guest checkout details
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    phone: '',
    pinCode: '',
    address: '',
    landmark: '',
    optionalPhone: '',
    email: ''
  });
  const { items, getTotalAmount, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | ''>('');
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initialize guest details with user data if available
  useEffect(() => {
    if (user) {
      const defaultAddress = user.addresses?.[0];
      setGuestDetails({
        name: user.name || '',
        phone: user.phone || '',
        pinCode: user.pinCode || defaultAddress?.pinCode || '',
        address: defaultAddress?.address || '',
        landmark: defaultAddress?.landmark || '',
        optionalPhone: defaultAddress?.optionalPhone || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const savedPin = getFromLocalStorage(LOCAL_STORAGE_KEYS.USER_PIN, null);
  const availableSlots = getAvailableTimeSlots();
  
  const subtotal = getTotalAmount();
  const deliveryFee = subtotal >= 300 ? 0 : 40;
  const maxLoyaltyUse = user && user.loyaltyPoints >= 300 ? Math.min(user.loyaltyPoints, subtotal * 0.5) : 0;
  const loyaltyDiscount = useLoyaltyPoints ? maxLoyaltyUse : 0;
  const total = subtotal + deliveryFee - loyaltyDiscount;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (!savedPin) {
      toast.error('Please select your delivery area first');
      navigate('/');
      return;
    }
  }, [items.length, savedPin, navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select delivery date and time slot');
      return;
    }
    
    // Validate delivery details for all users
    if (!guestDetails.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!guestDetails.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!guestDetails.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!guestDetails.address.trim()) {
      toast.error('Address is required');
      return;
    }
    if (!guestDetails.landmark.trim()) {
      toast.error('Landmark is required');
      return;
    }
    if (!guestDetails.pinCode || !/^\d{6}$/.test(guestDetails.pinCode.trim())) {
      toast.error('Valid PIN code is required');
      return;
    }

    setIsProcessing(true);

    try {
      // Create or get user account
      let orderUser = user;
      if (!orderUser) {
        // Create user account seamlessly
        try {
          orderUser = await createUserIfNotExists(guestDetails.email, {
            name: guestDetails.name,
            phone: guestDetails.phone,
            pinCode: guestDetails.pinCode
          });
          
          // Send magic link for future logins
          await signInWithEmail(guestDetails.email);
          toast.success('Account created! Check your email for a magic link to sign in next time.');
        } catch (error) {
          console.error('Error creating user:', error);
          toast.error('Failed to create account. Please try again.');
          return;
        }
      }

      // Create order object
      const orderData = {
        user_id: orderUser.id,
        items: items,
        total,
        delivery_fee: deliveryFee,
        loyalty_used: loyaltyDiscount,
        delivery_date: selectedDate,
        time_slot: selectedTimeSlot,
        address: {
          name: guestDetails.name,
          phone: guestDetails.phone,
          address: guestDetails.address,
          pinCode: guestDetails.pinCode,
          landmark: guestDetails.landmark,
          optionalPhone: guestDetails.optionalPhone,
        },
        status: 'confirmed'
      };

      // Save order to Supabase
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Update user loyalty points and total purchases
      let loyaltyEarned = 0;
      if (orderUser.totalPurchases === 0 && subtotal >= 300) {
        loyaltyEarned = 100; // First order bonus
      } else {
        loyaltyEarned = Math.floor(subtotal * 0.1); // 10% cashback
      }
      
      const newLoyaltyPoints = orderUser.loyaltyPoints + loyaltyEarned - loyaltyDiscount;
      const newTotalPurchases = orderUser.totalPurchases + subtotal;

      // Update user in Supabase
      await supabase
        .from('users')
        .update({
          loyalty_points: newLoyaltyPoints,
          total_purchases: newTotalPurchases,
          name: guestDetails.name,
          phone: guestDetails.phone,
          pin_code: guestDetails.pinCode
        })
        .eq('id', orderUser.id);

      // Save/update address
      await supabase
        .from('addresses')
        .upsert({
          user_id: orderUser.id,
          name: guestDetails.name,
          phone: guestDetails.phone,
          address: guestDetails.address,
          pin_code: guestDetails.pinCode,
          landmark: guestDetails.landmark,
          optional_phone: guestDetails.optionalPhone,
          is_default: true
        });

      // Update local user state
      updateUser({
        loyaltyPoints: newLoyaltyPoints,
        totalPurchases: newTotalPurchases,
        name: guestDetails.name,
        phone: guestDetails.phone,
        pinCode: guestDetails.pinCode
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const availableDates = [...new Set(availableSlots.map(slot => slot.date))];
  const availableTimeSlotsForDate = availableSlots.filter(slot => slot.date === selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Delivery Details - Always shown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
          <p className="text-sm text-gray-600 mb-4">
            {user ? 'Confirm or update your delivery details' : 'Please provide your details for delivery'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={guestDetails.name}
              onChange={e => setGuestDetails({ ...guestDetails, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={guestDetails.phone}
              onChange={e => setGuestDetails({ ...guestDetails, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="PIN Code *"
              value={guestDetails.pinCode || ''}
              onChange={e => setGuestDetails({ ...guestDetails, pinCode: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              maxLength={6}
              required
            />
            <input
              type="tel"
              placeholder="Additional Phone (Optional)"
              value={guestDetails.optionalPhone}
              onChange={e => setGuestDetails({ ...guestDetails, optionalPhone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Complete Address *"
              value={guestDetails.address}
              onChange={e => setGuestDetails({ ...guestDetails, address: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Landmark *"
              value={guestDetails.landmark}
              onChange={e => setGuestDetails({ ...guestDetails, landmark: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mt-4">
            <input
              type="email"
              placeholder="Email *"
              value={guestDetails.email || ''}
              onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-700">
              <strong>Note:</strong> {user ? 'Any changes will be saved to your profile.' : 'We\'ll create an account for you and send a magic link to your email for easy future logins.'}
            </p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Delivery Area</h2>
              </div>
              {deliveryFee > 0 && subtotal >= 99 && subtotal < 300 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-orange-700">
                    Add ₹{300 - subtotal} more for free delivery!
                  </p>
                </div>
              )}
              {savedPin && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-700">{savedPin.region} - {savedPin.pin}</p>
                </div>
              )}
            </div>


            {/* Delivery Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Delivery Schedule</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                We'll pack it fresh & fast. Choose your date & time.
              </p>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {availableDates.map(date => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTimeSlot('');
                      }}
                      className={`p-3 border rounded-xl text-left transition-colors ${
                        selectedDate === date
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">
                        {format(new Date(date), 'EEE, MMM d')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(date), 'yyyy')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Select Time Slot
                  </label>
                  {availableTimeSlotsForDate.map(slot => (
                    <button
                      key={slot.timeSlot}
                      onClick={() => setSelectedTimeSlot(slot.timeSlot)}
                      disabled={!slot.available}
                      className={`w-full p-3 border rounded-xl text-left transition-colors ${
                        !slot.available
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : selectedTimeSlot === slot.timeSlot
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formatTimeSlot(slot.timeSlot)}</span>
                        {!slot.available && (
                          <span className="text-xs text-red-500">Not available</span>
                        )}
                      </div>
                    </button>
                  ))}
                  
                  {availableTimeSlotsForDate.every(slot => !slot.available) && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <p className="text-sm text-orange-700">
                          No slots available for this date. Please select another date.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Loyalty Points */}
            {user && user.loyaltyPoints >= 300 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Use Loyalty Credits</h3>
                    <p className="text-sm text-gray-600">Available: ₹{user.loyaltyPoints}</p>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useLoyaltyPoints}
                      onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                      useLoyaltyPoints ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        useLoyaltyPoints ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
                {useLoyaltyPoints && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      You'll save ₹{loyaltyDiscount} on this order
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={`${item.productId}-${item.variant.weight}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} ({item.variant.weight}) x {item.quantity}
                    </span>
                    <span className="font-medium">₹{item.variant.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Loyalty Discount</span>
                    <span className="font-medium text-green-600">-₹{loyaltyDiscount}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Loyalty Earning Info */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  You'll earn ₹{Math.floor(subtotal * 0.1)} in loyalty credits with this order!
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!selectedDate || !selectedTimeSlot || isProcessing}
                className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 ${
                  selectedDate && selectedTimeSlot && !isProcessing
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-gray-500 text-center">
                By placing this order, you agree to our terms and conditions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 lg:h-0" />
    </div>
  );
};

export default CheckoutPage;