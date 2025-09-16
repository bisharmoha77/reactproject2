import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { dispatch } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_TO_CART',
      payload: { menuItem: item, quantity: 1 }
    });
    
    // Show success message
    const event = new CustomEvent('showAlert', {
      detail: { message: `${item.name} added to cart!`, type: 'success' }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.isPopular && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Popular
            </span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-orange-600 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <Link to={`/menu/${item.id}`} className="block p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
            {item.name}
          </h3>
          <span className="text-2xl font-bold text-orange-600">${item.price}</span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-700">{item.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({item.reviewCount})</span>
          </div>
          <span className="text-sm text-orange-600 font-medium capitalize">
            {item.category}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default MenuCard;