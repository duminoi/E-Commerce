import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'failed' | 'loading'>('loading');

  useEffect(() => {
    const code = searchParams.get('vnp_ResponseCode');
    if (code === '00') setStatus('success');
    else if (code) setStatus('failed');
    else setStatus('failed');
  }, [searchParams]);

  return (
    <main className="flex-grow pt-[104px] pb-3xl flex items-center justify-center px-gutter">
      <div className="w-full max-w-md">
        {status === 'loading' ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-xl text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="font-h2 text-h2 text-on-surface mb-2">Đang xử lý</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Đang xử lý kết quả thanh toán...
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-tertiary-container/20 mb-6">
              <span className="material-symbols-outlined text-4xl text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h1 className="font-h2 text-h2 font-bold text-on-surface mb-2">Thanh toán thành công</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Cảm ơn bạn đã thanh toán. Đơn hàng đang được xử lý.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to={ROUTES.ORDERS}
                className="w-full bg-primary-container text-on-primary font-label-md py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">receipt_long</span>
                Xem đơn hàng
              </Link>
              <Link
                to={ROUTES.HOME}
                className="w-full border border-outline-variant text-on-surface font-label-md py-4 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-6">
              <span className="material-symbols-outlined text-4xl text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
            </div>
            <h1 className="font-h2 text-h2 font-bold text-on-surface mb-2">Thanh toán thất bại</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Giao dịch không thành công. Vui lòng thử lại.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to={ROUTES.CHECKOUT}
                className="w-full bg-primary-container text-on-primary font-label-md py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">refresh</span>
                Thử lại
              </Link>
              <Link
                to={ROUTES.HOME}
                className="w-full border border-outline-variant text-on-surface font-label-md py-4 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}