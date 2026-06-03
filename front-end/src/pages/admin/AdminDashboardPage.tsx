import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
      .then(r => r.json())
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Tổng đơn hàng', value: stats?.totalOrders ?? '...', color: 'bg-blue-500', link: ROUTES.ADMIN.ORDERS },
    { label: 'Doanh thu', value: stats?.revenue != null ? formatCurrency(stats.revenue) : '...', color: 'bg-green-500', link: ROUTES.ADMIN.ORDERS },
    { label: 'Sản phẩm', value: stats?.totalProducts ?? '...', color: 'bg-purple-500', link: ROUTES.ADMIN.PRODUCTS },
    { label: 'Người dùng', value: stats?.totalUsers ?? '...', color: 'bg-orange-500', link: ROUTES.ADMIN.USERS },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Bảng điều khiển</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map(card => (
          <Link key={card.label} to={card.link} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-white text-lg font-bold">{String(card.value).charAt(0)}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold mb-4">Đơn hàng gần đây</h2>
        {stats?.recentOrders?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600">{formatCurrency(order.totalPrice)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
