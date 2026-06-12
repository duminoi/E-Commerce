import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../../api/order.api';
import { showToast } from '../../components/ui/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ROUTES } from '../../utils/constants';

const statusLabels: Record<string, string> = {
  PENDING: 'Chá» xá»­ lÃ½',
  CONFIRMED: 'ÄÃ£ xÃ¡c nháº­n',
  SHIPPING: 'Äang giao',
  DELIVERED: 'ÄÃ£ giao',
  CANCELLED: 'ÄÃ£ há»§y',
};

const statusSteps = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      orderApi.findById(id)
        .then(({ data }) => setOrder(data.data))
        .catch(() => navigate(ROUTES.ORDERS));
    }
  }, [id]);

  if (!order) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-surface-container rounded w-1/3" />
          <div className="h-40 bg-surface-container rounded-xl" />
          <div className="h-60 bg-surface-container rounded-xl" />
        </div>
      </main>
    );
  }

  const handleCancel = async () => {
    if (!confirm('Báº¡n cÃ³ cháº¯c muá»‘n há»§y Ä‘Æ¡n hÃ ng nÃ y?')) return;
    try {
      await orderApi.cancel(order.id);
      showToast.success('ÄÃ£ há»§y Ä‘Æ¡n hÃ ng');
      const { data } = await orderApi.findById(order.id);
      setOrder(data.data);
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Há»§y Ä‘Æ¡n tháº¥t báº¡i');
    }
  };

  const addr = order.addressSnapshot;
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 font-caption text-caption text-on-surface-variant/70 mb-lg">
        <Link className="hover:text-primary transition-colors" to="/">Trang chá»§</Link>
        <span>/</span>
        <Link className="hover:text-primary transition-colors" to={ROUTES.ORDERS}>ÄÆ¡n hÃ ng</Link>
        <span>/</span>
        <span className="text-on-surface">#{order.id.slice(0, 8)}</span>
      </nav>

      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-h1 text-h1 text-on-surface">Chi tiáº¿t Ä‘Æ¡n hÃ ng</h1>
          <p className="font-caption text-caption text-on-surface-variant mt-1">
            MÃ£ Ä‘Æ¡n: {order.id.slice(0, 8)}... â€” {formatDate(order.createdAt)}
          </p>
        </div>
        {order.status === 'PENDING' && (
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-error/30 text-error font-caption hover:bg-error/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
            Há»§y Ä‘Æ¡n
          </button>
        )}
      </div>

      <div className="space-y-lg">
        {/* Status Tracker */}
        {order.status !== 'CANCELLED' && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-lg">Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng</h2>
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-outline-variant/30" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
              />
              {statusSteps.map((step, idx) => (
                <div key={step} className="relative flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      idx <= currentStep
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container border border-outline-variant/50 text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {idx === 0 && 'pending'}
                      {idx === 1 && 'check_circle'}
                      {idx === 2 && 'local_shipping'}
                      {idx === 3 && 'task_alt'}
                    </span>
                  </div>
                  <span className={`font-caption text-caption mt-2 text-center ${
                    idx <= currentStep ? 'text-primary font-medium' : 'text-on-surface-variant'
                  }`}>
                    {statusLabels[step]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.status === 'CANCELLED' && (
          <div className="bg-error/5 rounded-xl border border-error/20 p-lg flex items-center gap-4">
            <span className="material-symbols-outlined text-3xl text-error">cancel</span>
            <div>
              <p className="font-body-md font-medium text-error">ÄÆ¡n hÃ ng Ä‘Ã£ há»§y</p>
              <p className="text-caption text-on-surface-variant">ÄÆ¡n hÃ ng nÃ y Ä‘Ã£ Ä‘Æ°á»£c há»§y</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          {/* Left: Items */}
          <div className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
              <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                <h2 className="font-label-md text-label-md text-on-surface font-semibold">Sáº£n pháº©m</h2>
              </div>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-surface-container-low rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">image</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-md font-medium text-on-surface">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-caption text-on-surface-variant">{item.variantName}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-caption text-on-surface-variant">x{item.quantity}</span>
                        <span className="text-caption text-on-surface-variant">Ã—</span>
                        <span className="text-caption text-on-surface-variant">{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <span className="font-body-md font-medium text-on-surface">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/30 mt-lg pt-lg flex justify-between">
                <span className="font-h3 text-[18px] font-semibold text-on-surface">Tá»•ng cá»™ng</span>
                <span className="font-h3 text-[18px] font-semibold text-primary">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Delivery Address */}
          <div className="lg:col-span-1">
            {addr && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
                <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <h2 className="font-label-md text-label-md text-on-surface font-semibold">Äá»‹a chá»‰ giao hÃ ng</h2>
                </div>
                <div>
                  <p className="font-body-md font-medium text-on-surface">{addr.fullName}</p>
                  <p className="text-caption text-on-surface-variant mt-1">{addr.phone}</p>
                  <p className="text-caption text-on-surface-variant mt-2">
                    {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}