import { Link, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const adminNav = [
  { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD },
  { label: 'Sản phẩm', path: ROUTES.ADMIN.PRODUCTS },
  { label: 'Đơn hàng', path: ROUTES.ADMIN.ORDERS },
  { label: 'Người dùng', path: ROUTES.ADMIN.USERS },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <Link to={ROUTES.ADMIN.DASHBOARD} className="text-xl font-bold text-blue-600 block mb-6">Admin</Link>
        <nav className="space-y-1">
          {adminNav.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
