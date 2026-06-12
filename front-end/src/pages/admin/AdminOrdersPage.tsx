import { useState, useEffect } from 'react';
import { orderApi } from '../../api/order.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { showToast } from '../../components/ui/Toast';

const statusColors: Record<string, string> = {
  PENDING: 'bg-secondary-container/20 text-secondary',
  CONFIRMED: 'bg-primary/10 text-primary',
  SHIPPING: 'bg-primary/10 text-primary',
  DELIVERED: 'bg-tertiary-container/20 text-tertiary',
  CANCELLED: 'bg-error/10 text-error',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const statusIcons: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'check_circle',
  SHIPPING: 'local_shipping',
  DELIVERED: 'task_alt',
  CANCELLED: 'cancel',
};

const nextStatus: Record<string, string> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'SHIPPING',
  SHIPPING: 'DELIVERED',
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

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateStatus(id, status);
      showToast.success('Cập nhật trạng thái thành công');
      loadOrders();
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Thất bại');
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface-container rounded w-1/4" />
        <div className="h-96 bg-surface-container rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-lg">
        <h1 className="font-h2 text-h2 text-on-surface">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-[20px] shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="text-left px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Ngày
                </th>
                <th className="text-right px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-center px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-body-md text-on-surface font-medium">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-caption text-on-surface-variant">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right font-body-md font-medium text-on-surface">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-caption font-medium ${statusColors[order.status] || ''}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {statusIcons[order.status] || 'info'}
                      </span>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {nextStatus[order.status] && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, nextStatus[order.status])}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-caption hover:bg-primary/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {order.status === 'PENDING' && 'check'}
                          {order.status === 'CONFIRMED' && 'local_shipping'}
                          {order.status === 'SHIPPING' && 'task_alt'}
                        </span>
                        {order.status === 'PENDING' && 'Xác nhận'}
                        {order.status === 'CONFIRMED' && 'Giao hàng'}
                        {order.status === 'SHIPPING' && 'Hoàn thành'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">receipt_long</span>
                    <p className="text-on-surface-variant">Chưa có đơn hàng</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}