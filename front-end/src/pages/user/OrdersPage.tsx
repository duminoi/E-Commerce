import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/order.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    orderApi.findByUser().then(({ data }) => setOrders(data.data?.items || [])).catch(() => {});
  }, []);

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Đơn hàng</h1>
        <p className="text-gray-500">Chưa có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <Link key={order.id} to={`/orders/${order.id}`}
            className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                <p className="font-medium mt-1">{order.items?.length} sản phẩm</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || ''}`}>
                  {statusLabels[order.status] || order.status}
                </span>
                <p className="font-bold text-blue-600 mt-1">{formatCurrency(order.totalPrice)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
