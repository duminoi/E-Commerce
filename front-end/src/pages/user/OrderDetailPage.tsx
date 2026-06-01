import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/order.api';
import { showToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../utils/constants';

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xử lý', CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) orderApi.findById(id).then(({ data }) => setOrder(data.data)).catch(() => navigate(ROUTES.ORDERS));
  }, [id]);

  if (!order) return <div className="text-center py-16 text-gray-500">Đang tải...</div>;

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      await orderApi.cancel(order.id);
      showToast.success('Đã hủy đơn hàng');
      const { data } = await orderApi.findById(order.id);
      setOrder(data.data);
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Hủy đơn thất bại');
    }
  };

  const addr = order.addressSnapshot;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Chi tiết đơn hàng</h1>
      <p className="text-sm text-gray-500 mb-6">Mã đơn: {order.id.slice(0, 8)}... — {formatDate(order.createdAt)}</p>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-2">Trạng thái</h2>
          <span className="px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
            {statusLabels[order.status] || order.status}
          </span>
          {order.status === 'PENDING' && (
            <Button variant="danger" size="sm" className="ml-4" onClick={handleCancel}>Hủy đơn</Button>
          )}
        </div>

        {addr && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="font-semibold mb-2">Địa chỉ giao hàng</h2>
            <p className="text-gray-700">{addr.fullName} - {addr.phone}</p>
            <p className="text-gray-500 text-sm">{addr.detail}, {addr.ward}, {addr.district}, {addr.province}</p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">Sản phẩm</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  {item.variantName && <p className="text-sm text-gray-500">{item.variantName}</p>}
                  <p className="text-sm text-gray-500">x{item.quantity}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
            <span>Tổng cộng</span>
            <span className="text-blue-600">{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
