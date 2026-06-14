import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ScrollProgress } from '../components/ui/ScrollProgress';
import { ScrollToTop } from '../components/ui/ScrollToTop';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProductListPage } from '../pages/products/ProductListPage';
import { ProductDetailPage } from '../pages/products/ProductDetailPage';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { OrdersPage } from '../pages/user/OrdersPage';
import { OrderDetailPage } from '../pages/user/OrderDetailPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { WishlistPage } from '../pages/wishlist/WishlistPage';
import { ChatPage } from '../pages/chat/ChatPage';
import { PaymentResultPage } from '../pages/payment/PaymentResultPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.25, 0.1, 0.25, 1] as const,
  duration: 0.35,
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public + user layout */}
        <Route
          element={
            <>
              <Header />
              <Outlet />
              <Footer />
            </>
          }
        >
          <Route
            path="/"
            element={
              <AnimatedPage>
                <HomePage />
              </AnimatedPage>
            }
          />
          <Route
            path="/login"
            element={
              <AnimatedPage>
                <LoginPage />
              </AnimatedPage>
            }
          />
          <Route
            path="/register"
            element={
              <AnimatedPage>
                <RegisterPage />
              </AnimatedPage>
            }
          />
          <Route
            path="/products"
            element={
              <AnimatedPage>
                <ProductListPage />
              </AnimatedPage>
            }
          />
          <Route
            path="/products/:slug"
            element={
              <AnimatedPage>
                <ProductDetailPage />
              </AnimatedPage>
            }
          />
          <Route
            path="/payment/result"
            element={
              <AnimatedPage>
                <PaymentResultPage />
              </AnimatedPage>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/cart"
              element={
                <AnimatedPage>
                  <CartPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/checkout"
              element={
                <AnimatedPage>
                  <CheckoutPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/orders"
              element={
                <AnimatedPage>
                  <OrdersPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <AnimatedPage>
                  <OrderDetailPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/profile"
              element={
                <AnimatedPage>
                  <ProfilePage />
                </AnimatedPage>
              }
            />
            <Route
              path="/wishlist"
              element={
                <AnimatedPage>
                  <WishlistPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/chat"
              element={
                <AnimatedPage>
                  <ChatPage />
                </AnimatedPage>
              }
            />
          </Route>
        </Route>

        {/* Admin layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <AnimatedPage>
                  <AdminDashboardPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AnimatedPage>
                  <AdminProductsPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AnimatedPage>
                  <AdminOrdersPage />
                </AnimatedPage>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AnimatedPage>
                  <AdminUsersPage />
                </AnimatedPage>
              }
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background">
        <ScrollProgress />
        <AnimatedRoutes />
        <ScrollToTop />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            '!bg-surface-container-lowest !text-on-surface !border !border-outline-variant/30 !rounded-xl !shadow-[0px_4px_20px_rgba(15,23,42,0.1)] !font-[Inter] !text-sm',
          success: {
            iconTheme: {
              primary: '#007e37',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ba1a1a',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}
