import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import MenuCard from '../components/MenuCard';

const OrderPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartTotal = state.cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 5.99 : 0;
  const tax = (cartTotal + deliveryFee) * 0.08875; // 8.875% tax
  const finalTotal = cartTotal + deliveryFee + tax;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity: newQuantity } });
    }
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (orderType === 'delivery' && !customerInfo.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state.cart.length === 0) {
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Your cart is empty. Please add items before ordering.', type: 'error' }
      });
      window.dispatchEvent(event);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        customerName: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        items: state.cart,
        total: finalTotal,
        type: orderType,
        address: orderType === 'delivery' ? customerInfo.address : undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      dispatch({ type: 'CLEAR_CART' });

      // Show success message
      const event = new CustomEvent('showAlert', {
        detail: { 
          message: `Order placed successfully! ${orderType === 'delivery' ? 'Estimated delivery: 30-45 minutes' : 'Ready for pickup in 15-20 minutes'}`, 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);

      // Reset form
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });

    } catch (error) {
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Failed to place order. Please try again.', type: 'error' }
      });
      window.dispatchEvent(event);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Popular items for empty cart state
  const popularItems = state.menuItems.filter(item => item.isPopular);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Order Online
          </h1>
          <p className="text-xl text-gray-600">
            Enjoy our delicious food delivered to your door or ready for pickup
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h2>
              
              {state.cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
                  <p className="text-gray-400 mb-6">Add some delicious items to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.cart.map((item) => (
                    <div key={item.menuItem.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.menuItem.name}</h3>
                          <p className="text-sm text-gray-600">${item.menuItem.price}</p>
                          {item.specialInstructions && (
                            <p className="text-sm text-orange-600 italic">Note: {item.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Items (show when cart is empty) */}
            {state.cart.length === 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {popularItems.slice(0, 4).map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary and Checkout */}
          <div className="space-y-6">
            {/* Order Type */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Type</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`w-full flex items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                    orderType === 'delivery'
                      ? 'border-orange-600 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Truck className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Delivery</div>
                    <div className="text-sm text-gray-600">30-45 minutes</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`w-full flex items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                    orderType === 'takeaway'
                      ? 'border-orange-600 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ShoppingBag className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Takeaway</div>
                    <div className="text-sm text-gray-600">15-20 minutes</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Main St, Apt 4B, City, State 12345"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || state.cart.length === 0}
                className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ${
                  isSubmitting || state.cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-105'
                } text-white`}
              >
                {isSubmitting ? 'Processing...' : `Place Order - $${finalTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;