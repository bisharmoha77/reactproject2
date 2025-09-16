import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Alert from './components/Alert';
import Home from './pages/Home';
import Menu from './pages/Menu';
import MenuItemDetail from './pages/MenuItemDetail';
import Reservations from './pages/Reservations';
import Order from './pages/Order';
import Reviews from './pages/Reviews';
import Admin from './pages/Admin';

interface AlertState {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

function App() {
  const [alert, setAlert] = useState<AlertState>({ message: '', type: 'success', show: false });

  useEffect(() => {
    const handleAlert = (event: CustomEvent) => {
      setAlert({
        message: event.detail.message,
        type: event.detail.type,
        show: true
      });
    };

    window.addEventListener('showAlert', handleAlert as EventListener);

    return () => {
      window.removeEventListener('showAlert', handleAlert as EventListener);
    };
  }, []);

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<MenuItemDetail />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/order" element={<Order />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          <Footer />
          
          {alert.show && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={closeAlert}
            />
          )}
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;