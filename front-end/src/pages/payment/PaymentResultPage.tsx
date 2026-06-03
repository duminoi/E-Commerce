import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'loading' ? (
          <div className="py-8">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Đang xử lý kết quả thanh toán...</p>
          </div>
        ) : status === 'success' ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công</h1>
            <p className="text-gray-600 mb-6">Cảm ơn bạn đã thanh toán. Đơn hàng đang được xử lý.</p>
            <Link to={ROUTES.ORDERS}><Button>Xem đơn hàng</Button></Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
            <p className="text-gray-600 mb-6">Giao dịch không thành công. Vui lòng thử lại.</p>
            <Link to={ROUTES.CHECKOUT}><Button>Thử lại</Button></Link>
          </>
        )}
      </div>
    </div>
  );
}
