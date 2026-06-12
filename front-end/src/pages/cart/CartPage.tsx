import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../utils/constants';

export function CartPage() {
  const { items, total, itemCount, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">login</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Đăng nhập để xem giỏ hàng</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Bạn cần đăng nhập để quản lý giỏ hàng của mình
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary font-label-md py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined">login</span>
            Đăng nhập
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading && items.length === 0) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 flex gap-4">
              <div className="w-24 h-24 bg-surface-container rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-surface-container rounded w-1/2" />
                <div className="h-3 bg-surface-container rounded w-1/3" />
                <div className="h-4 bg-surface-container rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex-grow pt-[104px] pb-3xl px-gutter max-w-max_width mx-auto w-full">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">shopping_cart</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">Giỏ hàng trống</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
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
        <span className="text-on-surface">Giỏ hàng</span>
      </nav>

      <h1 className="font-h1 text-h1 text-on-surface mb-lg">
        Giỏ hàng <span className="text-on-surface-variant">({itemCount} sản phẩm)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => {
            const price = item.variant?.price ?? item.product?.price ?? 0;
            const image = item.product?.images?.find((i: any) => i.isThumbnail)?.url || item.product?.images?.[0]?.url || '/placeholder.png';
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg flex gap-lg"
              >
                <img
                  src={image}
                  alt={item.product?.name}
                  className="w-28 h-28 object-cover rounded-lg bg-surface-container-low"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-body-md font-medium text-on-surface line-clamp-1">{item.product?.name}</h3>
                      {item.variant && (
                        <p className="text-caption text-on-surface-variant mt-1">
                          {item.variant.name}: {item.variant.value}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-outline-variant/50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 && updateItem(item.id, item.quantity - 1)}
                        className="px-2 py-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="px-3 py-1.5 font-body-md text-on-surface text-center min-w-[40px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="px-2 py-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                    <span className="font-h3 text-[18px] font-semibold text-on-surface">
                      {formatCurrency(price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-lg sticky top-[104px]">
            <h2 className="font-label-md text-label-md text-on-surface font-semibold mb-lg pb-md border-b border-outline-variant/30">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3 mb-lg">
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
              onClick={() => navigate(ROUTES.CHECKOUT)}
              className="w-full bg-primary-container text-on-primary font-label-md py-4 rounded-xl hover:bg-blue-700 transition-colors active:scale-[0.98] shadow-[0px_12px_32px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">lock</span>
              Tiến hành thanh toán
            </button>

            <Link
              to={ROUTES.PRODUCTS}
              className="w-full mt-3 text-center block font-caption text-caption text-primary hover:underline py-2"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}