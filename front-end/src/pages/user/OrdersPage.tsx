import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/order.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../utils/constants';

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

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderApi.findByUser()
      .then(({ data }) => setOrders(data.data?.items || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-surface-container rounded w-1/3" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                </div>
                <div className="h-6 bg-surface-container rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">receipt_long</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Chưa có đơn hàng</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Hãy mua sắm để tạo đơn hàng đầu tiên
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-md py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined">storefront</span>
            Mua sắm ngay
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant/70 mb-lg">
        <Link className="hover:text-primary transition-colors" to="/">Trang chủ</Link>
        <span>/</span>
        <span className="text-on-surface">Đơn hàng</span>
      </nav>

      <h1 className="font-h1 text-h1 text-on-surface mb-lg">Đơn hàng của tôi</h1>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg card-hover"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">
                    {statusIcons[order.status] || 'receipt'}
                  </span>
                </div>
                <div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="font-body-md font-medium text-on-surface mt-1">
                    {order.items?.length || 0} sản phẩm
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-caption font-medium ${statusColors[order.status] || ''}`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {statusIcons[order.status] || 'info'}
                  </span>
                  {statusLabels[order.status] || order.status}
                </span>
                <p className="font-h3 text-[18px] font-semibold text-on-surface mt-2">
                  {formatCurrency(order.totalPrice)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}