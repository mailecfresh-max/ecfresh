import React from 'react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types';
import { Package, Clock, MapPin, Phone } from 'lucide-react';
import { formatTimeSlot } from '../../utils/timeSlots';

const OrdersTab: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedOrders: Order[] = data.map(order => ({
        id: order.id,
        userId: order.user_id,
        items: order.items,
        total: order.total,
        deliveryFee: order.delivery_fee,
        loyaltyUsed: order.loyalty_used,
        deliveryDate: order.delivery_date,
        timeSlot: order.time_slot,
        address: order.address,
        status: order.status,
        createdAt: order.created_at
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      
      setOrders(prev => prev.map(o => 
        o.id === id ? { ...o, status: 'cancelled' as const } : o
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600">Your order history will appear here once you place your first order.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Orders</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-200 rounded-xl p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-gray-900 text-lg">₹{order.total}</div>
                <div className="text-sm text-gray-600">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{item.product.name}</div>
                        <div className="text-gray-600">{item.variant.weight} × {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-medium">₹{item.variant.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Delivery Schedule</span>
                </div>
                <div className="text-sm text-gray-600">
                  {format(new Date(order.deliveryDate), 'EEE, MMM dd, yyyy')}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTimeSlot(order.timeSlot)}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">Delivery Address</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{order.address.name}</div>
                  <div>{order.address.address}</div>
                  <div>{order.address.landmark}, {order.address.pinCode}</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <Phone className="w-3 h-3" />
                    <span>{order.address.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{order.total - order.deliveryFee + order.loyaltyUsed}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
              )}
              {order.loyaltyUsed > 0 && (
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-green-600">Loyalty Discount</span>
                  <span className="text-green-600">-₹{order.loyaltyUsed}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-semibold pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            {/* Actions */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTab;