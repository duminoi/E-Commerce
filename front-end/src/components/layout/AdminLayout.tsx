import { Link, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const adminNav = [
  { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: 'dashboard' },
  { label: 'Sản phẩm', path: ROUTES.ADMIN.PRODUCTS, icon: 'inventory_2' },
  { label: 'Đơn hàng', path: ROUTES.ADMIN.ORDERS, icon: 'receipt_long' },
  { label: 'Người dùng', path: ROUTES.ADMIN.USERS, icon: 'group' },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar — uses glass effect from Apex Commerce design system */}
      <aside className="admin-sidebar w-64 p-lg fixed top-0 left-0 bottom-0 overflow-y-auto sidebar-scroll">
        <div className="mb-lg pb-md border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">admin_panel_settings</span>
            </div>
            <div>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Admin Panel</h2>
              <p className="text-caption text-on-surface-variant">Quản lý hệ thống</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-all ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-lg pt-md border-t border-outline-variant/30">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content — uses .admin-page for consistent padding/spacing */}
      <main className="flex-1 ml-64 admin-page">
        <Outlet />
      </main>
    </div>
  );
}