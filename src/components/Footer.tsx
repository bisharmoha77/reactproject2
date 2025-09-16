import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Savoria</h3>
            <p className="text-gray-300 mb-4">
              Experience culinary excellence with our carefully crafted dishes made from the finest ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">123 Gourmet Street, City, ST 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-orange-400 mr-3" />
                <span className="text-gray-300">info@savoria.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-400 mr-3" />
                <div className="text-gray-300">
                  <p>Mon-Thu: 11:00 AM - 10:00 PM</p>
                  <p>Fri-Sat: 11:00 AM - 11:00 PM</p>
                  <p>Sunday: 10:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Savoria Restaurant. All rights reserved. Built with passion for great food.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;