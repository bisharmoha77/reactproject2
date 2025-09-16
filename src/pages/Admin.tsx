import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MenuItem, Reservation, Order } from '../types';

const Admin: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations' | 'orders'>('menu');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'breakfast' as MenuItem['category'],
    image: '',
    isPopular: false
  });

  const categories = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'desserts', label: 'Desserts' }
  ];

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'breakfast',
      image: '',
      isPopular: false
    });
    setShowModal(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      isPopular: item.isPopular || false
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const menuItem: MenuItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      rating: editingItem?.rating || 4.5,
      reviewCount: editingItem?.reviewCount || 0,
      isPopular: formData.isPopular
    };

    if (editingItem) {
      dispatch({ 
        type: 'UPDATE_MENU_ITEM', 
        payload: { id: editingItem.id, updates: menuItem }
      });
      
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Menu item updated successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
    } else {
      dispatch({ type: 'ADD_MENU_ITEM', payload: menuItem });
      
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Menu item added successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
    }
    
    setShowModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch({ type: 'DELETE_MENU_ITEM', payload: id });
      
      const event = new CustomEvent('showAlert', {
        detail: { message: 'Menu item deleted successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
    }
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    dispatch({ 
      type: 'UPDATE_RESERVATION', 
      payload: { id, updates: { status } }
    });
    
    const event = new CustomEvent('showAlert', {
      detail: { message: `Reservation ${status} successfully!`, type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    dispatch({ 
      type: 'UPDATE_ORDER', 
      payload: { id, updates: { status } }
    });
    
    const event = new CustomEvent('showAlert', {
      detail: { message: `Order status updated to ${status}!`, type: 'success' }
    });
    window.dispatchEvent(event);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'completed': return 'text-green-700 bg-green-100';
      case 'pending': case 'preparing': return 'text-yellow-700 bg-yellow-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      case 'ready': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your restaurant operations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'menu', label: 'Menu Management', count: state.menuItems.length },
                { key: 'reservations', label: 'Reservations', count: state.reservations.length },
                { key: 'orders', label: 'Orders', count: state.orders.length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === key
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Menu Management */}
            {activeTab === 'menu' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                  <button
                    onClick={handleAddItem}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.menuItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-lg font-bold text-orange-600">${item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full capitalize">
                          {item.category}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reservations */}
            {activeTab === 'reservations' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservations</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                      <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Date & Time</th>
                        <th className="px-6 py-3">Guests</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.reservations.map((reservation) => (
                        <tr key={reservation.id} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{reservation.customerName}</div>
                              <div className="text-gray-500">{reservation.email}</div>
                              <div className="text-gray-500">{reservation.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {reservation.date} at {reservation.time}
                          </td>
                          <td className="px-6 py-4">{reservation.guests}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(reservation.status)}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              {reservation.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateReservationStatus(reservation.id, 'confirmed')}
                                    className="text-green-600 hover:bg-green-50 p-1 rounded"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>
                <div className="space-y-4">
                  {state.orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.customerName} - {order.phone}</p>
                          <p className="text-sm text-gray-600 capitalize">{order.type}</p>
                          {order.address && <p className="text-sm text-gray-600">{order.address}</p>}
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-bold text-gray-900 mt-1">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition-colors duration-200"
                          >
                            Start Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors duration-200"
                          >
                            Complete Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Menu Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as MenuItem['category'] }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700">
                  Mark as popular item
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;