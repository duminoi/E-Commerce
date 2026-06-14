import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { ROUTES } from '../../utils/constants';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const navItems = [
    { path: `${ROUTES.PRODUCTS}?category=electronics`, label: 'Electronics', categorySlug: 'electronics' },
    { path: `${ROUTES.PRODUCTS}?category=fashion`, label: 'Fashion', categorySlug: 'fashion' },
    { path: `${ROUTES.PRODUCTS}?category=furniture`, label: 'Furniture', categorySlug: 'furniture' },
    { path: `${ROUTES.PRODUCTS}?category=accessories`, label: 'Accessories', categorySlug: 'accessories' },
    { path: ROUTES.PRODUCTS, label: 'Sale', categorySlug: null },
  ];

  const isNavActive = (item: typeof navItems[number]) => {
    if (!location.pathname.startsWith('/products')) return false;
    const params = new URLSearchParams(location.search);
    const currentCategory = params.get('category');
    if (item.categorySlug === null) return !currentCategory;
    return currentCategory === item.categorySlug;
  };

  return (
    <motion.header
      className="fixed top-0 w-full z-50 border-b border-outline-variant/20"
      animate={{
        height: scrolled ? 60 : 72,
        backgroundColor: scrolled
          ? 'rgba(250, 248, 255, 0.92)'
          : 'rgba(250, 248, 255, 0.85)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
        boxShadow: scrolled
          ? '0px 1px 12px rgba(15, 23, 42, 0.08)'
          : '0px 1px 8px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div className="flex items-center justify-between px-gutter max-w-max_width mx-auto w-full h-full">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-xl">
          <Link
            to={ROUTES.HOME}
            className="text-on-surface font-heading font-bold tracking-tighter"
          >
            <motion.span
              animate={{ fontSize: scrolled ? '18px' : '22px' }}
              transition={{ duration: 0.3 }}
              className="block"
            >
              LUXE
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center gap-lg">
            {navItems.map((item) => {
              const active = isNavActive(item);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-[15px] font-medium transition-colors relative pb-0.5 ${
                    active
                      ? 'text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-xs text-on-surface-variant">
          {isAuthenticated ? (
            <>
              <Link
                to={ROUTES.WISHLIST}
                aria-label="Wishlist"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">favorite</span>
              </Link>

              <Link
                to={ROUTES.CART}
                aria-label="Cart"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95 relative"
              >
                <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="absolute top-1.5 right-1.5 bg-primary text-white text-[9px] w-[16px] h-[16px] rounded-full flex items-center justify-center font-semibold leading-none"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </Link>

              <Link
                to={ROUTES.ORDERS}
                aria-label="Orders"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </Link>

              <Link
                to={ROUTES.PROFILE}
                aria-label="Account"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">account_circle</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  to={ROUTES.ADMIN.DASHBOARD}
                  aria-label="Admin"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                aria-label="Login"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">login</span>
              </Link>
              <Link
                to={ROUTES.REGISTER}
                aria-label="Register"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low hover:text-primary transition-all duration-200 active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">person_add</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
