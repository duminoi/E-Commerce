import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { Button } from '../ui/Button';
import { ROUTES } from '../../utils/constants';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const navigate = useNavigate();
  useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-blue-600">
            E-Shop
          </Link>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link to={ROUTES.ADMIN.DASHBOARD} className="text-gray-600 hover:text-blue-600">
                    Quản trị
                  </Link>
                )}
                <Link to={ROUTES.CART} className="text-gray-600 hover:text-blue-600 relative">
                  Giỏ hàng
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>
                <Link to={ROUTES.ORDERS} className="text-gray-600 hover:text-blue-600">
                  Đơn hàng
                </Link>
                <Link to={ROUTES.PROFILE} className="text-gray-600 hover:text-blue-600">
                  {user?.fullName}
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
