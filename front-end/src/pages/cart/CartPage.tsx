import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../utils/constants';

export function CartPage() {
  const { items, total, itemCount, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-gray-600 mb-4">Vui lòng đăng nhập để xem giỏ hàng</p>
        <Link to={ROUTES.LOGIN}><Button>Đăng nhập</Button></Link>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Đang tải...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng</p>
        <Link to={ROUTES.PRODUCTS}><Button>Mua sắm ngay</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng ({itemCount} sản phẩm)</h1>
      <div className="space-y-4">
        {items.map((item: any) => {
          const price = item.variant?.price ?? item.product?.price ?? 0;
          const image = item.product?.images?.find((i: any) => i.isThumbnail)?.url || item.product?.images?.[0]?.url || '/placeholder.png';
          return (
            <div key={item.id} className="flex gap-4 bg-white rounded-lg border border-gray-200 p-4">
              <img src={image} alt={item.product?.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.product?.name}</h3>
                {item.variant && <p className="text-sm text-gray-500">{item.variant.name}: {item.variant.value}</p>}
                <p className="text-blue-600 font-bold mt-1">{formatCurrency(price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => item.quantity > 1 && updateItem(item.id, item.quantity - 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-50">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="w-8 h-8 border rounded hover:bg-gray-50">+</button>
                  <button onClick={() => removeItem(item.id)}
                    className="ml-4 text-sm text-red-500 hover:underline">Xóa</button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(price * item.quantity)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Tổng cộng:</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
        <Button className="w-full mt-4" size="lg" onClick={() => navigate(ROUTES.CHECKOUT)}>
          Tiến hành thanh toán
        </Button>
      </div>
    </div>
  );
}
