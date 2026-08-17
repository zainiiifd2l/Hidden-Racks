import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AccountDashboard from './pages/AccountDashboard';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState({});

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminPage = currentPage.startsWith('admin');

  return (
    <div class="min-h-screen flex flex-col bg-white">
      <Toast />

      {isAdminPage ? (
        <AdminLayout currentTab={currentPage} onNavigate={handleNavigate}>
          {currentPage === 'admin' || currentPage === 'admin-dashboard' ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : currentPage === 'admin-products' ? (
            <AdminProducts onNavigate={handleNavigate} />
          ) : currentPage === 'admin-add-product' ? (
            <AdminAddProduct onNavigate={handleNavigate} />
          ) : (
            <AdminDashboard onNavigate={handleNavigate} />
          )}
        </AdminLayout>
      ) : (
        <>
          <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
          
          <main class="flex-1">
            {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
            {currentPage === 'shop' && (
              <Shop
                onNavigate={handleNavigate}
                initialCategory={pageParams.category}
                initialSearch={pageParams.search}
                initialFilter={pageParams.filter}
              />
            )}
            {currentPage === 'product' && (
              <ProductDetail productId={pageParams.id} onNavigate={handleNavigate} />
            )}
            {currentPage === 'cart' && <Cart onNavigate={handleNavigate} />}
            {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
            {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
            {currentPage === 'register' && <Register onNavigate={handleNavigate} />}
            {currentPage === 'account' && (
              <AccountDashboard onNavigate={handleNavigate} initialTab={pageParams.tab} />
            )}
            {currentPage === 'about' && <About onNavigate={handleNavigate} />}
            {currentPage === 'contact' && <Contact onNavigate={handleNavigate} />}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
}
