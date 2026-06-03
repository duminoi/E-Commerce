import { useState, useEffect } from 'react';
import { orderApi } from '../../api/order.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { showToast } from '../../components/ui/Toast';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPING: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xử lý', CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};

const nextStatus: Record<string, string> = {
  PENDING: 'CONFIRMED', CONFIRMED: 'SHIPPING', SHIPPING: 'DELIVERED',
};

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = () => {
    orderApi.findAll(1, 50)
      .then(({ data }) => setOrders(data.data?.items || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateStatus(id, status);
      showToast.success('Cập nhật trạng thái thành công');
      loadOrders();
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Thất bại');
    }
  };

  if (isLoading) return <div className="text-center py-16 text-gray-500">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Mã đơn</th>
              <th className="text-left px-4 py-3 font-medium">Ngày</th>
              <th className="text-right px-4 py-3 font-medium">Tổng tiền</th>
              <th className="text-center px-4 py-3 font-medium">Trạng thái</th>
              <th className="text-center px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.totalPrice)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status] || ''}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {nextStatus[order.status] && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, nextStatus[order.status])}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {order.status === 'PENDING' ? 'Xác nhận' : order.status === 'CONFIRMED' ? 'Giao hàng' : 'Hoàn thành'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Chưa có đơn hàng</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
