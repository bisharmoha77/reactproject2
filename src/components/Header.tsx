import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservations', href: '/reservations' },
    { name: 'Order Online', href: '/order' },
    { name: 'Reviews', href: '/reviews' },
  ];

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">Decale</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart and Admin */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/order"
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <Link
              to="/admin"
              className="p-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              <User className="h-6 w-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 px-3 py-2">
              <Link
                to="/order"
                className="relative flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link
                to="/admin"
                className="flex items-center text-gray-700 hover:text-orange-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-6 w-6 mr-2" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;