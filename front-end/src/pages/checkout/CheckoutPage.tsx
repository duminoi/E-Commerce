import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { userApi } from '../../api/user.api';
import { orderApi } from '../../api/order.api';
import { showToast } from '../../components/ui/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../utils/constants';

export function CheckoutPage() {
  const { items, total, fetchCart } = useCartStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    userApi.getAddresses().then(({ data }) => {
      const addrs = data.data || [];
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
    }).catch(() => {});
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }
    setIsLoading(true);
    try {
      await orderApi.create({
        addressId: selectedAddressId,
        note: note || undefined,
      });
      showToast.success('Đặt hàng thành công!');
      navigate(ROUTES.ORDERS);
    } catch (err: any) {
      showToast.error(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_cart</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Giỏ hàng trống</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán
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
        <Link className="hover:text-primary transition-colors" to={ROUTES.CART}>Giỏ hàng</Link>
        <span>/</span>
        <span className="text-on-surface">Thanh toán</span>
      </nav>

      <h1 className="font-h1 text-h1 text-on-surface mb-lg">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl lg:gap-3xl">
        {/* Left: Shipping & Payment */}
        <div className="lg:col-span-7 space-y-lg">
          {/* Shipping Address */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Địa chỉ giao hàng</h2>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-lg">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">add_location</span>
                <p className="text-on-surface-variant mb-4">Chưa có địa chỉ nào</p>
                <Link to={ROUTES.PROFILE} className="text-primary hover:underline font-caption">
                  Thêm địa chỉ trong trang cá nhân →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr: any) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="w-4 h-4 rounded-full border-outline-variant text-primary focus:ring-primary/20 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-on-surface">{addr.fullName}</span>
                          <span className="text-on-surface-variant">—</span>
                          <span className="text-on-surface-variant">{addr.phone}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-on-surface-variant mt-1">
                          {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">payments</span>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Phương thức thanh toán</h2>
            </div>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 hover:border-outline-variant'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-primary focus:ring-primary/20"
                />
                <span className="material-symbols-outlined text-on-surface-variant">local_shipping</span>
                <div>
                  <p className="font-medium text-on-surface">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-caption text-on-surface-variant">Thanh toán tiền mặt khi giao hàng</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'banking'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 hover:border-outline-variant'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="banking"
                  checked={paymentMethod === 'banking'}
                  onChange={() => setPaymentMethod('banking')}
                  className="w-4 h-4 text-primary focus:ring-primary/20"
                />
                <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                <div>
                  <p className="font-medium text-on-surface">Chuyển khoản ngân hàng</p>
                  <p className="text-caption text-on-surface-variant">Thanh toán qua tài khoản ngân hàng</p>
                </div>
              </label>
            </div>
          </div>

          {/* Order Note */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg">
            <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Ghi chú đơn hàng</h2>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 h-24 resize-none text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg sticky top-[104px]">
            <div className="flex items-center gap-2 mb-lg pb-md border-b border-outline-variant/30">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              <h2 className="font-label-md text-label-md text-on-surface font-semibold">Đơn hàng</h2>
            </div>

            <div className="space-y-3 mb-lg max-h-64 overflow-y-auto">
              {items.map((item: any) => {
                const price = item.variant?.price ?? item.product?.price ?? 0;
                const image = item.product?.images?.find((i: any) => i.isThumbnail)?.url || item.product?.images?.[0]?.url || '/placeholder.png';
                return (
                  <div key={item.id} className="flex gap-3">
                    <img src={image} alt="" className="w-14 h-14 rounded-lg object-cover bg-surface-container-low" />
                    <div className="flex-1 min-w-0">
                      <p className="font-caption text-caption text-on-surface line-clamp-1">{item.product?.name}</p>
                      <p className="text-caption text-on-surface-variant">x{item.quantity}</p>
                    </div>
                    <span className="font-caption text-caption text-on-surface font-medium whitespace-nowrap">
                      {formatCurrency(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-outline-variant/30 pt-lg mb-lg">
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Tạm tính</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between font-body-md text-on-surface-variant">
                <span>Phí vận chuyển</span>
                <span className="text-tertiary-container">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between font-h3 text-[20px] font-semibold text-on-surface border-t border-outline-variant/30 pt-lg mb-lg">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isLoading || !selectedAddressId}
              className="w-full bg-primary-container text-on-primary font-label-md py-4 rounded-xl hover:bg-blue-700 transition-colors active:scale-[0.98] shadow-[0px_12px_32px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'check_circle'}</span>
              {isLoading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}