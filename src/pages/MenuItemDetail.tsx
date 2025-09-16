import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';

const MenuItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const item = state.menuItems.find(item => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/menu" className="text-orange-600 hover:text-orange-700">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        menuItem: item,
        quantity,
        specialInstructions: specialInstructions || undefined
      }
    });

    // Show success message
    const event = new CustomEvent('showAlert', {
      detail: { message: `${item.name} added to cart!`, type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/menu"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Menu
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 lg:h-full">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.isPopular && (
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular Choice
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    {item.name}
                  </h1>
                  <div className="text-right">
                    <span className="text-3xl lg:text-4xl font-bold text-orange-600">
                      ${item.price}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <StarRating rating={item.rating} readOnly />
                  <span className="ml-2 text-gray-600">
                    ({item.reviewCount} reviews)
                  </span>
                </div>

                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {item.category}
                </span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {item.description}
              </p>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border-t border-b border-gray-300 bg-gray-50 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any dietary restrictions or special requests..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors duration-200 transform hover:scale-105"
              >
                Add to Cart - ${(item.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetail;