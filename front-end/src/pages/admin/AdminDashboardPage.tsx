import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-secondary-container/20 text-secondary',
  CONFIRMED: 'bg-primary/10 text-primary',
  SHIPPING: 'bg-primary/10 text-primary',
  DELIVERED: 'bg-tertiary-container/20 text-tertiary',
  CANCELLED: 'bg-error/10 text-error',
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then((r) => r.json())
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    {
      label: 'Tổng đơn hàng',
      value: stats?.totalOrders ?? '...',
      icon: 'shopping_bag',
      color: 'bg-primary/10 text-primary',
      link: ROUTES.ADMIN.ORDERS,
    },
    {
      label: 'Doanh thu',
      value: stats?.revenue != null ? formatCurrency(stats.revenue) : '...',
      icon: 'payments',
      color: 'bg-tertiary-container/20 text-tertiary',
      link: ROUTES.ADMIN.ORDERS,
    },
    {
      label: 'Sản phẩm',
      value: stats?.totalProducts ?? '...',
      icon: 'inventory_2',
      color: 'bg-primary/10 text-primary',
      link: ROUTES.ADMIN.PRODUCTS,
    },
    {
      label: 'Người dùng',
      value: stats?.totalUsers ?? '...',
      icon: 'group',
      color: 'bg-secondary-container/20 text-secondary',
      link: ROUTES.ADMIN.USERS,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-lg">
        <h1 className="font-h2 text-h2 text-on-surface">Bảng điều khiển</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
          Chào mừng trở lại. Đây là tổng quan hệ thống.
        </p>
      </div>

      {/* Stats Grid — uses .admin-card.card-hover from design system */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="admin-card card-hover p-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-lg">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-full ${card.color}`}>
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>
            </div>
            <div className="font-h2 text-h2 text-on-surface">{card.value}</div>
          </Link>
        ))}
      </div>

      {/* Recent Orders — uses .admin-table-card from design system (tabular data) */}
      <div className="admin-table-card">
        <div className="p-lg border-b border-outline-variant/50 bg-surface-container-lowest flex justify-between items-center">
          <h2 className="font-h3 text-h3 text-on-surface">Đơn hàng gần đây</h2>
          <Link
            to={ROUTES.ADMIN.ORDERS}
            className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors flex items-center gap-xs"
          >
            Xem tất cả
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <div className="divide-y divide-outline-variant/50">
          {stats?.recentOrders?.length > 0 ? (
            stats.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="p-lg hover:bg-surface-container-low transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant">receipt</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">#{order.id.slice(0, 8)}</p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-caption font-medium ${statusColors[order.status] || ''}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-xl text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">inbox</span>
              <p className="text-on-surface-variant">Chưa có đơn hàng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}